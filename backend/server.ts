import {Server} from '@hapi/hapi';

import config from './config/server.cfg';
import registerPlugins from './config/server.plugins';
import connectDb from './db/mongodb';
import registerRoutes from './routes';
import logger from './utils/logger';

const {host, port} = config.app;
let server: Server;

export const init = async () => {
  server = new Server({host, port});
  await registerPlugins(server);
  registerRoutes(server);
  await server.initialize();
  return server;
};

export const prepareDb = async () => {
  server.listener.on('ready', start);
  connectDb(server);
  return server;
};

export const start = async () => {
  await server.start();
  logger.info(`🤖 Hapi server running at http://${host}:${port}`);
  return server;
};

process.on('unhandledRejection', err => {
  logger.error(err);
  process.exit(1);
});

/**
 * Do not call, init() and start(). This will allow you to initialize and start
 * the server from different files. The init() function will initialize the
 * server (starts the caches, finalizes plugin registration) but does not start
 * the server. This is what you will use in your tests. The start() function
 * will actually start the server. This is what you will use in our main
 * entry-point for the server
 *
 * @see https://hapi.dev/tutorials/testing
 */
