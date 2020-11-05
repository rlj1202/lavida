import {
    Column, Table, Model,
    PrimaryKey, AutoIncrement, AllowNull, ForeignKey, BelongsTo
} from 'sequelize-typescript'
import User from './User.model';

import IProblem from '../interfaces/IProblem';

@Table
export default class Problem extends Model<Problem> implements IProblem {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;

    @AllowNull(false)
    @Column
    title!: string;

    @AllowNull(false)
    @Column
    description!: string;

    @ForeignKey(() => User)
    @Column
    authorId!: number;

    @BelongsTo(() => User)
    author!: User;

    @AllowNull(false)
    @Column
    timeLimit!: number;

    @AllowNull(false)
    @Column
    memoryLimit!: number;
}