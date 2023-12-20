import type {BaseContext} from '@apollo/server';

declare global {
  interface ApolloServerContext extends BaseContext {
    token?: string;
  }
}

export {};
