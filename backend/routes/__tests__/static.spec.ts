import type {Server} from '@hapi/hapi';
import {agent as request} from 'supertest';

import {initServer} from '../../server';

let server: Server;

beforeAll(async () => {
  server = await initServer();
});

afterAll(async () => {
  await server.stop();
});

describe('Testing routes', () => {
  it('GET "/" responds with text', async () => {
    const reply = await request(server.listener).get('/');
    expect(reply.text).toEqual(
      '<h3>GraphQL API with Nodejs, Swagger and MongoDB</h3>',
    );
    expect(reply.statusCode).toEqual(200);
  });
});
