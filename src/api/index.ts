import { Router } from 'express';
import auth from './auth';
import rest from './rest';

export default function() {
    const app = Router();

    auth(app);
    rest(app);

    return app;
}