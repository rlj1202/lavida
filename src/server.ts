import 'reflect-metadata'

import express from 'express';

import loaders from './loaders';

async function startServer() {
    const server = express();
    console.log('> Server has been created');

    await loaders(server);
    console.log('> All loaders are completed');

    var port = 6000;
    var host = '127.0.0.1';

    server.listen(port, host, (err) => {
        if (err) throw err;
        console.log(`> Ready on http://${host}:${port}`);
    });
}
startServer();