import {ApolloServer} from '@apollo/server';
import {addMocksToSchema} from '@graphql-tools/mock';
import {makeExecutableSchema} from '@graphql-tools/schema';

import resolvers from '../graphql/resolvers';
import typeDefs from '../graphql/schemas';

/**
 * @see https://www.apollographql.com/docs/apollo-server/testing/mocking
 */
jest.mock('../server/apollo', () => {
  const apolloServer = new ApolloServer({
    // addMocksToSchema accepts a schema instance and provides
    // mocked data for each field in the schema
    schema: addMocksToSchema({
      schema: makeExecutableSchema({typeDefs, resolvers}),
      preserveResolvers: true,
    }),
  });

  return jest.fn(async () => {
    await apolloServer.start();
    return apolloServer;
  });
});
