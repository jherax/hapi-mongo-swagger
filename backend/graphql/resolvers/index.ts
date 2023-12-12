import paintingResolver, {type PaintingResponse} from './paintingResolver';
import userResolver, {
  type UserResponse,
  type UserWithToken,
} from './userResolver';

export default [paintingResolver, userResolver];

export type {PaintingResponse};
export type {UserResponse};
export type {UserWithToken};
