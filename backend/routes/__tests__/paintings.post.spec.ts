import type {Server} from '@hapi/hapi';
import {agent as request} from 'supertest';

import * as dbMock from '../../__mocks__/mongo.db';
import Painting from '../../models/Painting';
import {init} from '../../server';

let server: Server;
const v1 = '/api/v1';

beforeAll(async () => {
  await dbMock.setUp();
  server = await init();
});

afterEach(async () => {
  await dbMock.dropCollections();
});

afterAll(async () => {
  await dbMock.dropDatabase();
  await server.stop();
});

describe('Testing server routes', () => {
  it(`POST "${v1}/paintings" responsd with the entity created`, async () => {
    const PaintingSave = jest.spyOn(Painting.prototype, 'save');

    const payload: IPainting = {
      name: 'Major Painting Styles',
      url: 'https://www.thoughtco.com/art-styles-explained-realism-to-abstract-2578625',
      techniques: ['Realism', 'Impressionism', 'Expressionism', 'Abstraction'],
    };

    const reply = await request(server.listener)
      .post(`${v1}/paintings`)
      .send(payload);
    const outData: IPainting = reply.body.data;

    expect(reply.statusCode).toEqual(200);
    expect(outData._id).toBeDefined();
    expect(outData.createdAt).toBeDefined();
    expect(outData.name).toBe(payload.name);
    expect(PaintingSave).toHaveBeenCalledTimes(1);
  });
});
