import {
    Model, Table, Column,
    PrimaryKey, AllowNull, AutoIncrement,
    BelongsTo, ForeignKey
} from 'sequelize-typescript'

import User from './User.model'
import Board from './Board.model';

@Table
export default class Post extends Model<Post> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;

    @AllowNull(false)
    @Column
    title!: string;

    @ForeignKey(() => User)
    @Column
    authorId!: number;

    @BelongsTo(() => User)
    author!: User;

    @ForeignKey(() => Board)
    @Column
    boardId!: number;

    @BelongsTo(() => Board)
    board!: Board;

    @Column
    content!: string;
}