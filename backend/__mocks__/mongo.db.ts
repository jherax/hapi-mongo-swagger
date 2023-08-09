import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';

/**
 * @see https://javascript.plainenglish.io/unit-test-your-mongoose-model-using-jest-2daf2303c4bf
 */

let mongo: MongoMemoryServer = undefined;

export const setUp = async () => {
  const options = {
    useNewUrlParser: true,
    autoIndex: false, // Don't build indexes
  };
  mongo = await MongoMemoryServer.create();
  const url = mongo.getUri();
  await mongoose.connect(url, options);
};

export const dropDatabase = async () => {
  if (mongo) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  }
};

export const dropCollections = async () => {
  if (mongo) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  }
};