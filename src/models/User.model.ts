import {
    Model, Table, Column,
    Unique, PrimaryKey,
    AllowNull, AutoIncrement
} from 'sequelize-typescript';
import { IUser } from '../interfaces/IUser';

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
}