import {type Model} from 'mongoose';

declare global {
  interface IPainting {
    name: string;
    url: string;
    techniques: string[];
    createdAt?: string;
    updatedAt?: string;
    _id?: string;
  }

  type PaintingModel = Model<IPainting, Record<string, never>>;
}
