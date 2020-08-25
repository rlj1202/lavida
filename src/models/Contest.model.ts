import {
    Model, Table, Column, PrimaryKey, AutoIncrement
} from 'sequelize-typescript'

@Table
export default class Contest extends Model<Contest> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id!: number;

    @Column
    title!: string;
}