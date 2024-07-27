import '../../__mocks__/apollo';

import type {Server} from '@hapi/hapi';
import {agent as request} from 'supertest';

import {NodeServer} from '../../server';
import initApollo from '../../server/apollo';

/**
 * @see https://blog.logrocket.com/testing-typescript-apps-using-jest/
 */
describe("E2E: Testing router's default paths", () => {
  jest.spyOn(NodeServer.prototype, 'start').mockImplementation(jest.fn());
  let appInstance: NodeServer;
  let server: Server;

  beforeAll(async () => {
    const apollo = await initApollo();
    appInstance = new NodeServer(apollo);
    await appInstance.initialize();
    server = appInstance.server;
  });

  afterAll(async () => {
    await server.stop();
  });

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
