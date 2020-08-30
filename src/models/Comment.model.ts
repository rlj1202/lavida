import {
    Model, Table, Column,
    PrimaryKey, AllowNull, AutoIncrement,
    ForeignKey, BelongsTo, CreatedAt, UpdatedAt
} from 'sequelize-typescript'

import Post from './Post.model'
import User from './User.model';

import IComment from '../interfaces/IComment';

@Table
export default class Comment extends Model<Comment> implements IComment {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;

    @AllowNull(false)
    @Column
    content!: string;

    @ForeignKey(() => User)
    @Column
    authorId!: number;

    @BelongsTo(() => User, 'authorId')
    author!: User;

    @ForeignKey(() => Post)
    @Column
    postId!: number;

    @BelongsTo(() => Post, 'postId')
    post!: Post;

    @CreatedAt
    createdAt!: Date;

    @UpdatedAt
    updatedAt!: Date;
}