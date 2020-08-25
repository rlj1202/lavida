import { Router } from 'express';
import auth from './auth';

export default function() {
    const app = Router();

    auth(app);

    return app;
}