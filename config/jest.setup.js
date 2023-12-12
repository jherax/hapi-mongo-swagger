const path = require('node:path');
const {ApolloServer} = require('@apollo/server');
const {addMocksToSchema} = require('@graphql-tools/mock');
const {makeExecutableSchema} = require('@graphql-tools/schema');

/**
 * Jest-Timers
 * @see https://jestjs.io/docs/timer-mocks
 *
 * You can call jest.useFakeTimers() or jest.useRealTimers() from anywhere
 * (top level, inside an it block, etc.), but it is a global operation and
 * will affect other tests within the same file.
 *
 * Additionally, you need to call jest.useFakeTimers() to reset internal
 * counters before each test. By default jest uses "modern" timers, then
 * if you want to inspect setTimeout or setInterval you will need to call
 * spyOn() upon those methods. If you use "legacy", that won't be required.
 *
 * @example
 *
 * beforeEach(() => jest.useFakeTimers('legacy'|'modern'))
 * afterEach(() => jest.useRealTimers())
 */

// ---------------------------------
// Jest mock is hoisted before any module import

jest.mock('../backend/server/config', () => {
  return {
    app: {
      host: 'localhost',
      port: 8888,
      public: path.join(process.cwd(), '/backend/public'),
      logLevel: 'info',
      maxRequests: 5,
      jwtPrivateKey: 'my_secret_word',
      jwtExpiryTime: '5m',
    },
    db: {
      host: 'localhost',
      port: 9999,
      database: 'test-db',
      username: 'contoso',
      password: 'costoso',
    },
  };
});

jest.mock('../backend/utils/logger', function () {
  const originalModule = jest.requireActual('../backend/utils/logger');
  // this env var is set in VS Code launch file, for debugging
  if (process.env.SHOW_LOGGER) {
    return originalModule;
  }
  return {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  };
});

/** @see https://www.apollographql.com/docs/apollo-server/testing/mocking/ */
jest.mock('../backend/server/apollo', () => {
  const typeDefs = `#graphql
  type Painting {
    _id: String
    name: String!
    author: String!
    year: String!
    url: String
  }

  type Query {
    getPaintingById(id: String!): Painting
  }
  `;

  const resolvers = {
    Query: {
      getPaintingById: () => ({
        name: 'The Birth of Venus',
        author: 'Sandro Botticelli',
        year: '1484-1486',
        url: 'https://media.timeout.com/images/103166737/750/562/image.webp',
      }),
    },
  };

  const apolloServer = new ApolloServer({
    // addMocksToSchema accepts a schema instance and provides
    // mocked data for each field in the schema
    schema: addMocksToSchema({
      schema: makeExecutableSchema({typeDefs, resolvers}),
    }),
  });

  return {
    __esModule: true,
    default: jest.fn(async () => {
      await apolloServer.start();
      return apolloServer;
    }),
  };
});
