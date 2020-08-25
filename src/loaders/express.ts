import { Express, Router } from 'express';
import bodyParser from 'body-parser';
import next from 'next';

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