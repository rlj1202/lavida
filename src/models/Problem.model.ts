import {
    Column, Table, Model, PrimaryKey, AutoIncrement
} from 'sequelize-typescript'

@Table
export default class Problem extends Model<Problem> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;

    @Column
    title!: string;

    @Column
    timeLimit!: number;

    @Column
    memoryLimit!: number;
}