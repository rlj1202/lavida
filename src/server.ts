import 'reflect-metadata'

import express from 'express';

import loaders from './loaders';

async function startServer() {
    const server = express();
    console.log('> Server has been created');

    await loaders(server);
    console.log('> All loaders are completed');

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
}
startServer();