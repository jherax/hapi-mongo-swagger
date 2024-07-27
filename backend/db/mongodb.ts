import {setTimeout} from 'node:timers/promises';

import type {Server} from '@hapi/hapi';
import mongoose from 'mongoose';

import config from '../server/config';
import events from '../server/events';
import logger from '../utils/logger';

/**
 * @see https://github.com/docker/awesome-compose/blob/master/react-express-mongodb/backend/db/index.js
 * @see https://mongoosejs.com/docs/5.x/docs/connections.html
 */
const options: mongoose.ConnectOptions = {
  autoIndex: false, // Don't build indexes
  // maxPoolSize: 10, // Maintain up to 10 socket connections
};

const responseMsg = {
  success: '🍃 MongoDB is connected',
  failure: '🍃 MongoDB connection failed, retry in 3 secs.',
  error: 'Maximum number of connection retries reached',
};

mongoose.Promise = global.Promise;
const MAX_TRIES = 5;

async function connectDb(server: Server): Promise<void> {
  const {host, port, database, username, password} = config.db;
  const uri = `mongodb://${username}:${password}@${host}:${port}/${database}`;
  let intents = 0;

  const connectWithRetry = async () => {
    return mongoose
      .connect(uri, options)
      .then(() => {
        logger.info(responseMsg.success);
        server.listener.emit(events.SERVER_READY);
      })
      .catch(err => {
        if (++intents === MAX_TRIES) {
          logger.error(err);
          throw Error(responseMsg.error);
        }
        logger.warn(`${responseMsg.failure}\n${err}`);
        return setTimeout(3000).then(connectWithRetry);
      });
  };

  return connectWithRetry();
}

export default connectDb;
