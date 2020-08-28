export interface IUser {
    id: number;
    authId: string;
    email: string;
    name: string;
}

export interface IUserRegisteration {
    id: string;
    name: string;
    email: string;
    password: string;
    passwordCheck: string;
}