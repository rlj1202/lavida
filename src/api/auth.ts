import { Container } from 'typedi';
import { Router, Request, Response } from 'express';

import AuthService from '../services/auth';

import { IUserRegisteration } from '../interfaces/IUser'

export default function Auth(app: Router) {
    var router = Router();

    router.post('/signup', async (req: Request, res: Response) => {
        const serviceInstance = Container.get(AuthService);
        await serviceInstance.SignUp(req.body as IUserRegisteration);

        // XXX
        console.log(req.body as IUserRegisteration);
        
        res.redirect('/');
    });
    router.post('/signin', async (req: Request, res: Response) => {
        const serviceInstance = Container.get(AuthService);
        var result = await serviceInstance.SignIn(req.body.id, req.body.password);

        if (req.session) {
            if (result) {
                req.session.userId = result.id;
                req.session.userName = result.name;

                res.redirect('/');
                return;
            }
        }

        res.redirect('/auth/signin');
    });
    router.get('/signout', async (req: Request, res: Response) => {
        // const serviceInstance = Container.get(AuthService);
        req.session?.destroy((err) => {
            if (err) {
                // cannot access session here
                console.log(err);
            }
        });
        res.redirect('/');
    });
    app.use('/auth', router);
}