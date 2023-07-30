import type {Server} from '@hapi/hapi';
import {agent as request} from 'supertest';

import paintingsMock from '../../__mocks__/paintings.json';
import Painting from '../../models/Painting';
import {init} from '../../server';

const v1 = '/api/v1';
let server: Server;

beforeAll(async () => {
  const jsonValues: IPainting[] = paintingsMock;
  const exec = jest.fn().mockResolvedValue(jsonValues);
  const lean = jest.fn(() => ({exec}));
  Painting.find = jest.fn(() => ({lean} as never));

  server = await init();
});

afterAll(async () => {
  await server.stop();
});

describe('Testing server routes', () => {
  it(`GET "${v1}/paintings" responds with list of Painting`, async () => {
    const reply = await request(server.listener).get(`${v1}/paintings`);
    expect(reply.statusCode).toEqual(200);
    expect(reply.body.data).toHaveLength(2);
    expect(Painting.find).toHaveBeenCalledTimes(1);
  });
});
