import type {ApolloServer} from '@apollo/server';
import hapiApolloPlugin from '@as-integrations/hapi';
import Boom from '@hapi/boom';
import type {Request, ResponseToolkit, Server} from '@hapi/hapi';
import inertPlugin from '@hapi/inert';
import rateLimitPlugin from 'hapi-rate-limit';

import logger from '../utils/logger';
import config from './config';

export default function registerPlugins(
  hapiServer: Server,
  apolloServer: ApolloServer<ApolloServerContext>,
) {
  return hapiServer.register([
    inertPlugin,
    {
      /** @see https://github.com/wraithgar/hapi-rate-limit */
      plugin: rateLimitPlugin,
      options: {
        enabled: false,
        pathLimit: false,
        userLimit: false,
        userPathCache: {
          expiresIn: 60 * 60 * 1000, // 1 hour
          // segment: 'hapi-rate-limit-userPath',
        },
        userPathLimit: config.app.maxRequests,
        limitExceededResponse: (request: Request, reply: ResponseToolkit) => {
          const message = 'Limit of requests exceeded, please try again later';
          const error = Boom.tooManyRequests(message);
          error.output.payload.success = false;
          logger.error(message);
          error.reformat();
          return error;
        },
      },
    },
    {
      /** @see https://www.npmjs.com/package/@as-integrations/hapi */
      plugin: hapiApolloPlugin,
      options: {
        apolloServer,
        path: '/graphql',
        context: async ({request}) => {
          // we remove the word Bearer that specifies the strategy used,
          // and then pass the token to the context object in the resolvers.
          const auth: string = request.headers.authorization ?? '';
          const token: string = auth.replace('Bearer ', '');
          return {token} as ApolloServerContext;
        },
      },
    },
  ]);
}
