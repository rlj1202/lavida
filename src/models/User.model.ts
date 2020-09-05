import {
    Model, Table, Column,
    Unique, PrimaryKey,
    AllowNull, AutoIncrement, HasMany, Scopes, DefaultScope
} from 'sequelize-typescript';

import Comment from './Comment.model';

import { IUser } from '../interfaces/IUser';

@DefaultScope(() => ({
    attributes: {
        exclude: [ 'passwordHash' ]
    }
}))
@Scopes(() => ({
    full: {
        include: [ Comment ]
    },
    withPasswordHash: {
        attributes: {
            include: [ 'passwordHash' ]
        }
    },
    withoutPasswordHash: {
        attributes: {
            exclude: [ 'passwordHash' ]
        }
    }
}))
@Table
export default class User extends Model<User> implements IUser {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;

    @Unique
    @Column
    authId!: string;

    @Unique
    @AllowNull(false)
    @Column
    email!: string;

    @AllowNull(false)
    @Column
    passwordHash!: string;

    @AllowNull(false)
    @Column
    name!: string;

    @HasMany(() => Comment)
    comments!: Comment[];
}