import { Container } from 'typedi';
import { Router, Request, Response } from 'express';

import AuthService from '../services/auth';

import { IUserRegisteration } from '../interfaces/IUser'

export default function Auth(app: Router) {
    var router = Router();

    router.post('/signup', async (req: Request, res: Response) => {
        const serviceInstance = Container.get(AuthService);
        await serviceInstance.SignUp(req.body as IUserRegisteration);

        console.log(req.body as IUserRegisteration);
        
        res.json(req.body);
    });
    router.post('/signin', async (req: Request, res: Response) => {
        const serviceInstance = Container.get(AuthService);
        var result = await serviceInstance.SignIn(req.body.id, req.body.password);

        if (req.session) {
            if (result) {
                req.session.userId = result.id;
                req.session.userName = result.name;

                res.send(`Hello, ${result.name}!`);
                return;
            }
        }

        res.send('Failed to login');
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