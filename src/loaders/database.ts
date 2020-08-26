import { Sequelize } from 'sequelize-typescript';
import { setUncaughtExceptionCaptureCallback } from 'process';

export default async function() {
    // XXX Where the credential informations can be placed!!!
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: __dirname + '/../../lavida.sqlite'
    });
    sequelize.addModels([ __dirname + '/../models/**/*.model.ts' ]);
    await sequelize
        .sync()
        .then(() => {
            console.log('> Database connection has been established.');
        }).catch((err) => {
            console.log('> Unable to connect to the database: '+ err);
        });
    
    return sequelize;
}