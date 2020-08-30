import { IUser } from "./IUser";
import IBoard from "./IBoard";

export default interface IPost {
    id: number;
    title: string;
    authorId: number;
    boardId: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    author: IUser;
    board: IBoard;
}