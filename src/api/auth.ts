import { Container } from 'typedi';
import { Router, Request, Response } from 'express';

import AuthService from '../services/auth';

import { IUserRegisteration } from '../interfaces/IUser'

export default function Auth(app: Router) {
    var router = Router();

    router.post('/signup', (req: Request, res: Response) => {
        const serviceInstance = Container.get(AuthService);
        serviceInstance.SignUp(req.body as IUserRegisteration);

        console.log(req.body as IUserRegisteration);
        
        res.json(req.body);
    });
    router.post('/signin', async (req: Request, res: Response) => {
        const serviceInstance = Container.get(AuthService);
        var result = await serviceInstance.SignIn(req.body.id, req.body.password);

        if (req.session) {
            if (result) {
                req.session.id = req.body.id;
                req.session.name = req.body.name;
            }
        }

        res.send('Sign result : ' + result);
    });
    router.post('/signout', async (req: Request, res: Response) => {
        const serviceInstance = Container.get(AuthService);
        req.session?.destroy((err) => {
            // cannot access session here
        });
        res.send('This is signout api');
    });
    app.use('/auth', router);
}