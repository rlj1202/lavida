import {
    Model, Table, Column,
    PrimaryKey, NotNull, IsUUID
} from 'sequelize-typescript'

@Table
export default class Board extends Model<Board> {
    @IsUUID(4)
    @PrimaryKey
    @Column
    uuid!: string;

    @NotNull
    @Column
    title!: string;

    @Column
    description!: string;
}