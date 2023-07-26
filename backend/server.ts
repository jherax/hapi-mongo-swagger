import {Server} from '@hapi/hapi';

import config from './config/server.cfg';
import registerRoutes from './routes';

const {host, port} = config.app;
const server = new Server({host, port});

export const init = async () => {
  registerRoutes(server);
  await server.initialize();
  return server;
};

export const start = async () => {
  await server.start();
  console.info(`🤖 Hapi server running at http://${host}:${port}`);
  return server;
};

process.on('unhandledRejection', err => {
  console.error(err);
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
