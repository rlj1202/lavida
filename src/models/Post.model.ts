import {
    Model, Table, Column,
    PrimaryKey, NotNull, IsUUID,
    BelongsTo
} from 'sequelize-typescript'

import User from './User.model'

@Table
export default class Post extends Model<Post> {
    @IsUUID(4)
    @PrimaryKey
    @Column
    uuid!: string;

    @NotNull
    @Column
    title!: string;

    @BelongsTo(() => User, 'uuid')
    author!: User;

    @Column
    content!: string;
}