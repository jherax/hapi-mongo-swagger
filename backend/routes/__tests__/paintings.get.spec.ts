import type {Server} from '@hapi/hapi';
import {agent as request} from 'supertest';

import paintingsMock from '../../__mocks__/paintings.json';
import Painting from '../../models/Painting';
import {init} from '../../server';
import messages from '../../utils/messages';

let server: Server;
const v1 = '/api/v1';
const {SUCCESSFUL, INTERNAL_SERVER_ERROR} = messages;

describe(`Testing GET "${v1}/paintings" routes`, () => {
  Painting.find = jest.fn();

  beforeAll(async () => {
    server = await init();
  });

  beforeEach(() => {
    (Painting.find as jest.Mock).mockClear();
  });

  afterAll(async () => {
    await server.stop();
  });

  it(`should respond with a list of Paintings`, async () => {
    mockPaintingFind(paintingsMock);
    const reply = await request(server.listener).get(`${v1}/paintings`);
    expect(reply.statusCode).toEqual(200);
    expect(reply.body.data).toHaveLength(2);
    expect(Painting.find).toHaveBeenCalledTimes(1);
  });

  it(`should respond with an empty list`, async () => {
    mockPaintingFind([]);
    const reply = await request(server.listener).get(`${v1}/paintings`);
    const response: ServerResponse = reply.body;
    expect(response).toStrictEqual({
      statusCode: 200,
      message: SUCCESSFUL.message,
      success: true,
      data: [],
    });
    expect(Painting.find).toHaveBeenCalledTimes(1);
  });

  it(`should respond with 3 items when called with valid query parameters: "/paintings/2/?limit=3"`, async () => {
    const PAGE = 2;
    const LIMIT = 3;
    const mokedData: IPainting[] = [...paintingsMock, ...paintingsMock]
      .map((item, index) => {
        const id = index + LIMIT + 1;
        return {...item, _id: `${id}`};
      })
      .slice(0, LIMIT);
    const spyOnMethods = mockPaintingFind(mokedData);

    const reply = await request(server.listener).get(
      `${v1}/paintings/${PAGE}/?limit=${LIMIT}`,
    );

    const data: IPainting[] = reply.body.data;
    expect(data[0]._id).toBe('4');
    expect(data[2]._id).toBe('6');
    expect(data).toHaveLength(LIMIT);
    expect(reply.statusCode).toEqual(200);
    expect(spyOnMethods.skip).toHaveBeenCalledWith(3);
    expect(spyOnMethods.limit).toHaveBeenCalledWith(LIMIT);
  });

  it(`should return a 500 error when retrieving items from the database has failed`, async () => {
    (Painting.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockRejectedValue(new Error('Database error')),
    } as never);

    const reply = await request(server.listener).get(`${v1}/paintings`);
    const response: ServerResponse = reply.body;

    expect(response.statusCode).toBe(500);
    expect(response.message).toBe(INTERNAL_SERVER_ERROR.message);
    expect(response.success).toBe(false);
    expect(response.error.message).toBe('Database error');
    expect(response.error.stack).toBeDefined();
  });
});

function mockPaintingFind(items: IPainting[]) {
  const spyOnMethods = {
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lean: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValueOnce(items),
  };
  (Painting.find as jest.Mock).mockReturnValue(spyOnMethods);
  return spyOnMethods;
}
