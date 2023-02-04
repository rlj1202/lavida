import { Request } from 'express';

export interface IVerifyCallback<T extends (...args: any) => any = () => any> {
  validate(...args: Parameters<T>): ReturnType<T>;
}

export interface IVerifyCallbackWithRequest<
  T extends (request: Request, ...args: any) => any = (request: Request) => any,
> {
  validate(...args: Parameters<T>): ReturnType<T>;
}
