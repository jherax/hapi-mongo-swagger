import '../../__mocks__/apollo';

import type {Server} from '@hapi/hapi';
import {agent as request} from 'supertest';

import * as dbMock from '../../__mocks__/mongo.db';
import Painting from '../../models/Painting';
import {NodeServer} from '../../server';
import initApollo from '../../server/apollo';
import messages from '../../server/messages';

const PRODUCTS_PATH = `/api/v1/paintings`;
const {SUCCESSFUL_ADDED, INCOMPLETE_REQUEST, INTERNAL_SERVER_ERROR} = messages;

describe(`E2E: Testing POST "${PRODUCTS_PATH}" routes`, () => {
  jest.spyOn(NodeServer.prototype, 'start').mockImplementation(jest.fn());
  const PaintingSave = jest.spyOn(Painting.prototype, 'save');
  let appInstance: NodeServer;
  let server: Server;

  const PAYLOAD: IPainting = {
    name: 'Mona Lisa',
    year: '1503-1517',
    author: 'Leonardo Da Vinci',
    url: 'https://media.timeout.com/images/103166731/750/562/image.webp',
  };

  beforeAll(async () => {
    await dbMock.setUp();
    const apollo = await initApollo();
    appInstance = new NodeServer(apollo);
    await appInstance.initialize();
    server = appInstance.server;
  });

  afterEach(async () => {
    await dbMock.dropCollections();
    PaintingSave.mockClear();
  });

  afterAll(async () => {
    await dbMock.dropDatabase();
    await server.stop();
  });

  it(`should respond with the Painting entity created`, async () => {
    const reply = await request(server.listener)
      .post(PRODUCTS_PATH)
      .send(PAYLOAD);
    const outData: IPainting = reply.body.data;

    expect(reply.statusCode).toEqual(200);
    expect(outData._id).toBeDefined();
    expect(outData.name).toBe(PAYLOAD.name);
    expect(outData.createdAt).toBeDefined();
    expect(PaintingSave).toHaveBeenCalledTimes(1);
    expect(reply.body.message).toBe(SUCCESSFUL_ADDED.message);
  });

  it(`should return a 422 error when the body parameters are not valid`, async () => {
    const reply = await request(server.listener).post(PRODUCTS_PATH).send({});
    const response: ServerResponse = reply.body;
    const error = response.error;

    expect(response.statusCode).toBe(422);
    expect(response.message).toBe(INCOMPLETE_REQUEST.message);
    expect(response.success).toBe(false);
    expect(error.message).toBe('Required parameters missing');
    expect(error.stack).toContain('There are errors in the body payload');
  });

  it(`should return a 500 error when adding a painting to the database`, async () => {
    PaintingSave.mockRejectedValue(new Error('Database error'));

    const reply = await request(server.listener)
      .post(PRODUCTS_PATH)
      .send(PAYLOAD);
    const response: ServerResponse = reply.body;

    expect(response.statusCode).toBe(500);
    expect(response.message).toBe(INTERNAL_SERVER_ERROR.message);
    expect(response.success).toBe(false);
    expect(response.error.message).toBe('Database error');
    expect(response.error.stack).toBeDefined();
  });
});
