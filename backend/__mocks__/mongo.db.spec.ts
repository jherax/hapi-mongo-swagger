import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';

import {dropCollections, dropDatabase, setUp} from './mongo.db';

describe('Testing the mongodb-memory-server', () => {
  const connectSpy = jest.spyOn(mongoose, 'connect');
  let mongo: MongoMemoryServer;

  beforeEach(async () => {
    mongo = await setUp();
  });

  afterAll(async () => {
    await dropDatabase();
  });

  // Tests that the function uses the correct connection options and checks the readyState
  it('should use correct connection options and check readyState', async () => {
    const options = {
      autoIndex: false,
    };
    expect(connectSpy).toHaveBeenCalledWith(expect.any(String), options);
    expect(mongoose.connection.readyState).toBe(1);
  });

  // Tests that the function stops the MongoMemoryServer instance if it exists
  it('should stop the MongoMemoryServer instance if it exists', async () => {
    const dropDatabaseSpy = jest.spyOn(mongoose.connection, 'dropDatabase');
    const stopSpy = jest.spyOn(mongo, 'stop');
    await dropDatabase();
    await dropDatabase();
    expect(mongoose.connection.readyState).toBe(0);
    expect(dropDatabaseSpy).toHaveBeenCalledTimes(1);
    expect(stopSpy).toHaveBeenCalledTimes(1);
  });

  // Tests that all collections are deleted when there are collections in mongoose
  it('should delete all collections when there are collections in mongoose', async () => {
    const originalCollections = mongoose.connection.collections;
    const mockCollection = {
      deleteMany: jest.fn(),
    };

    const setCollections = collections => {
      Object.defineProperty(mongoose.connection, 'collections', {
        get: () => collections,
      });
    };

    // mock the collections object
    setCollections({
      collection1: mockCollection,
      collection2: mockCollection,
    });

    await dropCollections();
    expect(mockCollection.deleteMany).toHaveBeenCalledTimes(2);

    // restores the collections object
    setCollections(originalCollections);
  });
});
