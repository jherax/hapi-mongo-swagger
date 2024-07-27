import '../../__mocks__/apollo';

import {setTimeout} from 'node:timers/promises';

import mongoose, {type Mongoose} from 'mongoose';

import {NodeServer} from '../../server';
import initApollo from '../../server/apollo';
import config from '../../server/config';
import events from '../../server/events';
import logger from '../../utils/logger';

const {host, port, database, username, password} = config.db;
const connectUrl = `mongodb://${username}:${password}@${host}:${port}/${database}`;
const connectOptions: mongoose.ConnectOptions = {
  autoIndex: false,
};

jest.mock('node:timers/promises', () => {
  return {setTimeout: jest.fn().mockResolvedValue(void 0)};
});

// prevent the logger methods from writting the terminal
jest.mock('../../utils/logger', () => {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
});

describe('Connect database with retry using MongoDB and Mongoose', () => {
  jest.spyOn(NodeServer.prototype, 'start').mockImplementation(jest.fn());
  let emitter: jest.SpyInstance;
  let appInstance: NodeServer;

  beforeAll(async () => {
    const apollo = await initApollo();
    appInstance = new NodeServer(apollo);
    await appInstance.initialize();
    emitter = jest.spyOn(appInstance.server.listener, 'emit');
  });

  afterAll(async () => {
    await appInstance.server.stop();
  });

  // Database connection is successfully established with MongoDB
  it('should emit SERVER_READY event when database connection is successful', async () => {
    const connectMock = jest
      .spyOn<Mongoose, 'connect'>(mongoose, 'connect')
      .mockReturnValueOnce(Promise.resolve(mongoose));

    await appInstance.startDB();
    expect(connectMock).toHaveBeenCalledWith(connectUrl, connectOptions);
    expect(logger.info).toHaveBeenCalledWith('🍃 MongoDB is connected');
    expect(emitter).toHaveBeenCalledWith(events.SERVER_READY);
    connectMock.mockRestore();
  });

  // Invalid database credentials result in connection failure (with retries)
  it('should log error when database connection fails', async () => {
    const errorMsg = 'Maximum number of connection retries reached';
    const rejection = new Error('Authentication failed');
    const connecMock = jest
      .spyOn<Mongoose, 'connect'>(mongoose, 'connect')
      .mockRejectedValue(rejection);

    try {
      await appInstance.startDB();
    } catch (error) {
      expect(connecMock).toHaveBeenCalledTimes(5);
      expect(setTimeout).toHaveBeenCalledTimes(4);
      expect(logger.warn).toHaveBeenCalledTimes(4);
      expect(logger.error).toHaveBeenCalledTimes(1);
      expect(error.message).toBe(errorMsg);
    }
  });
});
