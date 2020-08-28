import { Container } from 'typedi';
import { Router, Request, Response } from 'express';

import AuthService from '../services/auth';

import User from '../models/User.model'
import { IUserRegisteration, IUser } from '../interfaces/IUser'

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
        var result: User | null = await serviceInstance.SignIn(req.body.id, req.body.password);

        if (req.session) {
            if (result) {
                req.session.user = result as IUser;
                
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
    router.get('/info', async (req: Request, res: Response) => {
        if (req.session?.user) {
            // TODO passwordHash field is also sended out
            // because casting cannot help remove
            // unused fields.
            res.json(req.session.user as IUser);
        } else {
            res.status(404).json(null);
        }
    });
    app.use('/auth', router);
}