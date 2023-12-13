import {type Model} from 'mongoose';

declare global {
  interface IUser {
    email: string;
    password: string;
    fullname: string;
    createdAt?: string;
    updatedAt?: string;
    _id?: string;
  }

  type UserModel = Model<IUser, Record<string, never>>;

  interface IUserJwt {
    userId?: string;
    email?: string;
    iat?: number;
    exp?: number;
  }
}

export {};
