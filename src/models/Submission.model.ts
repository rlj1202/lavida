import {
    Model, Table, Column,
    PrimaryKey, AutoIncrement, DataType, ForeignKey
} from 'sequelize-typescript'

import Problem from './Problem.model';
import User from './User.model';

@Table
export default class Submission extends Model<Submission> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;

    @Column(DataType.TEXT)
    code!: string;

    @Column({
        type: DataType.INTEGER,
        comment: 'Time the code takes while executing',
    })
    time!: number;

    @ForeignKey(() => Problem)
    @Column
    problemId!: number;

    @ForeignKey(() => User)
    @Column
    userId!: number;
}