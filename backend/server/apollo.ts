import {ApolloServer} from '@apollo/server';

import resolvers from '../graphql/resolvers';
import typeDefs from '../graphql/schemas';

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
