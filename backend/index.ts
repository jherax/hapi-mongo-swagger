import {NodeServer} from './server';
import initApollo from './server/apollo';
import events from './server/events';
import logger from './utils/logger';

/**
 * @see https://hapi.dev/tutorials/testing
 */
initApollo()
  .then(apollo => new NodeServer(apollo))
  .then(async nodeServer => {
    await nodeServer.initialize();
    await nodeServer.startDB();
  });

// Catch unhandling rejected promises
process.on(events.UNHANDLED_REJECTION, reason => {
  logger.error('UNHANDLED_REJECTION 👇');
  logger.error(reason);
  process.exit(1);
});

// Catch unhandling unexpected exceptions
process.on(events.UNCAUGHT_EXCEPTION, (error: Error) => {
  logger.error(`UNCAUGHT_EXCEPTION 👉 ${error.message}`);
  process.exit(1);
});
