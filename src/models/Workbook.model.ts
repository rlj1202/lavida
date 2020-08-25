import {
    Model, Table, Column,
    PrimaryKey, AutoIncrement
} from 'sequelize-typescript'

@Table
export default class Workbook extends Model<Workbook> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;

    @Column
    title!: string;

    @Column
    description!: string;
}