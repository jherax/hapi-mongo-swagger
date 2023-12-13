import {ApolloServer, type BaseContext} from '@apollo/server';

import resolvers from '../graphql/resolvers';
import typeDefs from '../graphql/schemas';

/**
 * @see https://www.apollographql.com/docs/apollo-server/getting-started/
 */
export default async function initApollo() {
  const apolloServer = new ApolloServer<BaseContext>({
    typeDefs,
    resolvers,
    includeStacktraceInErrorResponses: true,
    introspection: true,
    /** @see https://www.apollographql.com/docs/apollo-server/data/errors/#for-client-responses */
    // formatError: (formattedError, error) => { /* use logger and return formattedError */ }
  });

  await apolloServer.start();
  return apolloServer;
}
