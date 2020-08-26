import { Express, Router } from 'express';
import bodyParser from 'body-parser';
import next from 'next';
import session from 'express-session';

import apiRoute from '../api';

export default async function(server: Express) {// REST API
    /*
    var restRouter = Router();
    restRouter.get('/users/:id', (req, res) => {

    });
    restRouter.post('/users/create', (req, res) => {

    });
    server.use('/api/v1', restRouter);
    */

    // session
    // XXX Where the credential informations can be placed!!!
    server.set('trust proxy', 1);
    server.use(session({
        secret: 'not a secret', // XXX not a secret!!!
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: true
        }
    }));

    // parse application/x-www-form-urlencoded
    server.use(bodyParser.urlencoded({ extended: true }));
    // parse application/json
    server.use(bodyParser.json());

    // api
    server.use(apiRoute());

    // nextjs
    var dev: boolean = process.env.NODE_ENV !== 'production';
    var app = next({ dev });
    var handle = app.getRequestHandler();

    await app.prepare().then(() => {
        server.get('*', (req, res) => {
            return handle(req, res);
        });
    }).catch((err) => {
        console.log(err);
    });
}