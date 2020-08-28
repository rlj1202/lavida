import {
    Model, Table, Column,
    PrimaryKey, AllowNull, AutoIncrement,
    BelongsTo, ForeignKey, DataType
} from 'sequelize-typescript'

import User from './User.model'
import Board from './Board.model';
import IPost from '../interfaces/IPost';

@Table
export default class Post extends Model<Post> implements IPost {
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

    @Column(DataType.TEXT)
    content!: string;
}