import { IUser } from "./IUser";
import IPost from "./IPost";

export default interface IComment {
    id: number;
    content: string;
    authorId: number;
    author: IUser;
    postId: number;
    post: IPost;
    createdAt: Date;
    updatedAt: Date;
}