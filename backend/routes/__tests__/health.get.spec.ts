import type {Server} from '@hapi/hapi';
import {agent as request} from 'supertest';

import HealthCheck from '../../models/HealthCheck';
import {initServer} from '../../server';
import initApollo from '../../server/apollo';
import messages from '../../server/messages';

let server: Server;
const {SERVICE_UNAVAILABLE, INTERNAL_SERVER_ERROR, TOO_MANY_REQUESTS} =
  messages;

describe('E2E: Testing GET "/healthcheck"', () => {
  const findOneAndUpdateSpy = jest.spyOn(HealthCheck, 'findOneAndUpdate');

  beforeAll(async () => {
    const apolloServer = await initApollo();
    server = await initServer(apolloServer);
  });

  afterEach(() => {
    findOneAndUpdateSpy.mockClear();
  });

  afterAll(async () => {
    await server.stop();
  });

  it(`should respond with the check event from the database`, async () => {
    findOneAndUpdateSpy.mockResolvedValue({
      id: '64da7432ad8c2e8f887b75b8',
      event: 'check',
    });

    const reply = await request(server.listener).get(`/healthcheck`);
    const response: ServerResponse = reply.body;

    expect(reply.statusCode).toEqual(200);
    expect(response.data).toStrictEqual({
      server: {isUp: true},
      database: {isUp: true},
    });
    expect(findOneAndUpdateSpy).toHaveBeenCalledWith(
      {event: 'check'},
      {event: 'check'},
      {new: true, upsert: true},
    );
  });

  // Tests that when the database is down, a service unavailable response is sent
  it('should send 503 service unavailable response when database is down', async () => {
    findOneAndUpdateSpy.mockResolvedValue(null);

    const reply = await request(server.listener).get(`/healthcheck`);
    const response: ServerResponse = reply.body;

    expect(reply.statusCode).toEqual(503);
    expect(response.message).toBe(SERVICE_UNAVAILABLE.message);
    expect(response.data).toStrictEqual({
      server: {isUp: true},
      database: {isUp: false},
    });
  });

  // Tests that when an error occurs, an error response is sent
  it('should send error 500 response when an error occurs', async () => {
    findOneAndUpdateSpy.mockRejectedValue(new Error('Database error'));

    const reply = await request(server.listener).get(`/healthcheck`);
    const response: ServerResponse = reply.body;

    expect(reply.statusCode).toEqual(500);
    expect(response.message).toBe(INTERNAL_SERVER_ERROR.message);
    expect(response.success).toBe(false);
    expect(response.error.message).toBe('Database error');
    expect(response.error.stack).toBeDefined();
  });

  // Tests that the rate limiter middleware is used when making a GET request to '/healthcheck'
  it('should use rate limiter middleware and get an error for limit of requests exceeded', async () => {
    // Current setting 'hapi-rate-limit': {userPathLimit: 5}
    // Limits each IP to 5 requests per window (every hour).
    // Consider all previous request() are teken into account.
    const responses = await Promise.all([
      request(server.listener).get(`/healthcheck`),
      request(server.listener).get(`/healthcheck`),
      request(server.listener).get(`/healthcheck`),
      request(server.listener).get(`/healthcheck`),
    ]);

    const lastResponse: ServerResponse = responses.pop().body;
    expect(lastResponse).toStrictEqual({
      error: TOO_MANY_REQUESTS.message,
      message: 'Limit of requests exceeded, please try again later',
      statusCode: 429,
      success: false,
    });
  });
});
