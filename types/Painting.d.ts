import {type Model} from 'mongoose';

declare global {
  interface IPainting {
    name: string;
    author: string;
    year: string;
    url?: string;
    createdAt?: string;
    updatedAt?: string;
    _id?: string;
  }

  type PaintingModel = Model<IPainting, Record<string, never>>;
}

export {};
