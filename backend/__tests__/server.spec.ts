import type {Server} from '@hapi/hapi';

import {initServer} from '../server';

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

describe('Server GET "/"', () => {
  let server: Server;

  beforeEach(async () => {
    server = await initServer();
  });

  afterEach(async () => {
    await server.stop();
  });

  it('responds with status code 200', async () => {
    const reply = await server.inject({
      method: 'get',
      url: '/',
    });

    expect(reply.statusCode).toBe(200);
    expect(reply.result).toBe(getExpectedText());
  });
});

function getExpectedText() {
  return `<h3>GraphQL API with Nodejs, Swagger and MongoDB</h3>`;
}
