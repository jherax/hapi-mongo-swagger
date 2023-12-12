import {type Model} from 'mongoose';

declare global {
  declare interface IUser {
    email: string;
    password: string;
    fullname: string;
    createdAt?: string;
    updatedAt?: string;
    _id?: string;
  }

  declare type UserModel = Model<IUser, Record<string, never>>;
}

export {};
