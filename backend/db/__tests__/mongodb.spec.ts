import type {Server} from '@hapi/hapi';
import mongoose, {type Mongoose} from 'mongoose';

import config from '../../config/server.cfg';
import {init} from '../../server';
import connectDb from '../mongodb';

jest.mock('../../config/server.cfg', () => {
  return {
    app: {
      host: 'localhost',
      port: 8888,
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

const {host, port, database, username, password} = config.db;

const expectedArgs = {
  connectSuccess: '🍃 MongoDB is connected',
  connectFail: '🍃 MongoDB connection failed, retry in 2 secs.\n',
  connectUrl: `mongodb://${username}:${password}@${host}:${port}/${database}`,
  connectOptions: {
    useNewUrlParser: true,
    autoIndex: false,
  },
};

describe('Connect database with retry', () => {
  const consoleInfoSpy = jest.spyOn(console, 'info');
  let server: Server;

  beforeAll(async () => {
    const TIMESTAMP = new Date().toISOString();
    jest.useFakeTimers().setSystemTime(new Date(TIMESTAMP));
    server = await init();
  });

  beforeEach(() => {
    consoleInfoSpy.mockClear();
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
    expect(consoleInfoSpy).toBeCalledWith(connectSuccess);
    mongooseConnectSpy.mockRestore();
  });

  it('should fail to connect to MongoDB', async () => {
    const mongooseConnectSpy = jest
      .spyOn<Mongoose, 'connect'>(mongoose, 'connect')
      .mockReturnValueOnce(Promise.reject(Error('Connect error')));
    try {
      await connectDb(server);
    } catch (error) {
      const {connectUrl, connectOptions, connectFail} = expectedArgs;
      expect(mongooseConnectSpy).toBeCalledWith(connectUrl, connectOptions);
      expect(consoleInfoSpy).toBeCalledWith(connectFail);
      expect(setTimeout).toHaveBeenCalled();
      mongooseConnectSpy.mockRestore();
    }
  });
});
