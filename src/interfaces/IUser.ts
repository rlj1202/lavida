export interface IUser {
    uuid: string;
    id: string;
    name: string;
    email: string;
    passwordHash: string;
}

export interface IUserRegisteration {
    id: string;
    name: string;
    email: string;
    password: string;
    passwordCheck: string;
}