import type {Server} from '@hapi/hapi';
import {agent as request} from 'supertest';

import {initServer} from '../../server';
import initApollo from '../../server/apollo';

/**
 * The init() function will initialize the server (starts cache,
 * finalizes plugin registration) but does not start the server.
 * This is what you will use in your tests. The start() function
 * will actually start the server. This is what you will use in our
 * main entry-point for the server.
 *
 * @see https://hapi.dev/tutorials/testing
 * @see https://blog.logrocket.com/testing-typescript-apps-using-jest/
 */
let server: Server;

beforeAll(async () => {
  const apolloServer = await initApollo();
  server = await initServer(apolloServer);
});

afterAll(async () => {
  await server.stop();
});

describe("E2E: Testing router's default paths", () => {
  it('should serve the README file when calling GET "/"', async () => {
    const reply = await request(server.listener).get('/');
    expect(reply.statusCode).toEqual(200);
    expect(reply.type).toBe('text/html');
    expect(reply.text).toMatch(
      'Hapi + Swagger, GraphQL + JWT, MongoDB + Winston',
    );
  });

  it('should serve the Apollo Sandbox when calling GET "/sandbox"', async () => {
    const reply = await request(server.listener).get('/sandbox');
    expect(reply.statusCode).toEqual(200);
    expect(reply.type).toBe('text/html');
    expect(reply.text).toMatch("id='embedded-sandbox'");
  });
});
