import { Container } from 'typedi';
import { Router, Request, Response } from 'express';
import AuthService from '../services/auth';

export default function Auth(app: Router) {
    var router = Router();

    router.post('/signup', (req: Request, res: Response) => {
        const serviceInstance = Container.get(AuthService);
        //serviceInstance.SignUp("", "");
        console.log(req.body);
        
        
        res.json(req.body);
    });
    router.post('/signin', async (req: Request, res: Response) => {
        const serviceInstance = Container.get(AuthService);
        //serviceInstance.SignIn("", "");
        res.send('This is signin api');
    });
    router.post('/signout', async (rea: Request, res: Response) => {
        const serviceInstance = Container.get(AuthService);
        res.send('This is signout api');
    });
    app.use('/auth', router);
}