import {
    Model, Table, Column,
    PrimaryKey, AllowNull, AutoIncrement, Unique,
    HasMany
} from 'sequelize-typescript'

import Post from './Post.model'

@Table
export default class Board extends Model<Board> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;

    @Unique
    @Column
    name!: string;

    @AllowNull(false)
    @Column
    title!: string;

    @Column
    description!: string;

    @HasMany(() => Post)
    posts!: Post[];
}