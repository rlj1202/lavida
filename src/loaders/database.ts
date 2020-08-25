import { Sequelize } from 'sequelize-typescript';

export default async function() {
    const sequelize = new Sequelize(
        'lavida',
        'rlj1202',
        '3737010shim',
        {
            host: 'localhost',
            dialect: 'mysql'
        }
    );
    sequelize.addModels([ __dirname + '/../models/**/*.model.ts' ]);
    return sequelize;
}