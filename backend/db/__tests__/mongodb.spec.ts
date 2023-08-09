import type {Server} from '@hapi/hapi';
import mongoose, {type Mongoose} from 'mongoose';

import config from '../../config/server.cfg';
import {init} from '../../server';
import logger from '../../utils/logger';
import connectDb from '../mongodb';

const {host, port, database, username, password} = config.db;

const expectedArgs = {
  connectSuccess: '🍃 MongoDB is connected',
  connectFail: '🍃 MongoDB connection failed, retry in 2 secs.',
  connectUrl: `mongodb://${username}:${password}@${host}:${port}/${database}`,
  connectOptions: {
    useNewUrlParser: true,
    autoIndex: false,
  },
};

describe('Connect database with retry', () => {
  const logError = jest.spyOn(logger, 'error');
  const logInfo = jest.spyOn(logger, 'info');
  let server: Server;

  beforeAll(async () => {
    const TIMESTAMP = new Date().toISOString();
    jest.useFakeTimers().setSystemTime(new Date(TIMESTAMP));
    server = await init();
  });

  beforeEach(() => {
    logInfo.mockClear();
  });

  afterAll(async () => {
    jest.clearAllTimers();
    await server.stop();
  });

  it('should connect to MongoDB', async () => {
    const mongooseConnectSpy = jest
      .spyOn<Mongoose, 'connect'>(mongoose, 'connect')
      .mockReturnValueOnce(Promise.resolve(mongoose));

    await connectDb(server);
    const {connectUrl, connectOptions, connectSuccess} = expectedArgs;
    expect(mongooseConnectSpy).toBeCalledWith(connectUrl, connectOptions);
    expect(logInfo).toBeCalledWith(connectSuccess);
    mongooseConnectSpy.mockRestore();
  });

  it('should fail to connect to MongoDB', async () => {
    const errorMsg = 'Reject connection to MongoDB';
    const mongooseConnectSpy = jest
      .spyOn<Mongoose, 'connect'>(mongoose, 'connect')
      .mockReturnValueOnce(Promise.reject(Error(errorMsg)));
    try {
      await connectDb(server);
    } catch (error) {
      const {connectUrl, connectOptions, connectFail} = expectedArgs;
      expect(mongooseConnectSpy).toBeCalledWith(connectUrl, connectOptions);
      expect(logInfo).toBeCalledWith(connectFail);
      expect(logError).toHaveBeenCalled();
      expect(setTimeout).toHaveBeenCalled();
      mongooseConnectSpy.mockRestore();
    }
  });
});