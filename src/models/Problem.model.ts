import {
    Column, Table, Model,
    PrimaryKey, AutoIncrement, AllowNull
} from 'sequelize-typescript'

@Table
export default class Problem extends Model<Problem> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;

    @AllowNull(false)
    @Column
    title!: string;

    @AllowNull(false)
    @Column
    timeLimit!: number;

    @AllowNull(false)
    @Column
    memoryLimit!: number;
}