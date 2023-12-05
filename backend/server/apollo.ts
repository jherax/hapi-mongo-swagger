import {ApolloServer} from '@apollo/server';

import resolvers from '../graphql/resolvers';
import typeDefs from '../graphql/schemas';

/**
 * @see https://www.apollographql.com/docs/apollo-server/getting-started/
 */
export default async function initApollo() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    includeStacktraceInErrorResponses: true,
    introspection: true,
  });

  await apolloServer.start();
  return apolloServer;
}
