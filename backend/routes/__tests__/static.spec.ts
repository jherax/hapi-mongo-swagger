import type {Server} from '@hapi/hapi';
import {agent as request} from 'supertest';

import {init} from '../../server';

let server: Server;

beforeAll(async () => {
  server = await init();
});

afterAll(async () => {
  await server.stop();
});

describe('Testing routes', () => {
  it('GET "/" responds with text', async () => {
    const reply = await request(server.listener).get('/');
    expect(reply.text).toEqual(
      '<h1>GraphQL API with Nodejs, Swagger and MongoDB</h1>',
    );
    expect(reply.statusCode).toEqual(200);
  });
});
