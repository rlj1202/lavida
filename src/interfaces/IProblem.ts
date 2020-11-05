import IUser from './IUser';

export default interface IProblem {
    id: number;
    title: string;
    description: string;
    authorId: number;
    author: IUser;
    timeLimit: number;
    memoryLimit: number;
};