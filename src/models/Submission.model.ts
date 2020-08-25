import {
    Model, Table, Column,
    PrimaryKey, AutoIncrement, DataType
} from 'sequelize-typescript'

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
}