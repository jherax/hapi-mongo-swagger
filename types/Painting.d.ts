import {type Model} from 'mongoose';

declare global {
  declare interface IPainting {
    name: string;
    url: string;
    techniques: string[];
    createdAt?: string;
    updatedAt?: string;
    _id?: string;
  }

  declare type PaintingModel = Model<IPainting, Record<string, never>>;
}

export {};
