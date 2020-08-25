import { Container } from 'typedi';
import { Express } from 'express';

import expressLoader from './express';
import databaseLoader from './database';

export default async function(server: Express) {
    await expressLoader(server);
    console.log('> Express loaded');

    var connection = await databaseLoader();
    Container.set('sequelize', connection)
    console.log('> Database loaded');
}