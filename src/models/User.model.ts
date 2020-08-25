import {
    Model, Table, Column, Unique, PrimaryKey,
    IsUUID, AllowNull
} from 'sequelize-typescript';

@Table
export default class User extends Model<User> {
    @IsUUID(4)
    @PrimaryKey
    @Column
    uuid!: string;

    @Unique
    @Column
    id!: string;

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