import '../../__mocks__/apollo';

import type {Server} from '@hapi/hapi';
import {agent as request} from 'supertest';

import paintingsMock from '../../__mocks__/paintings.json';
import Painting from '../../models/Painting';
import {initServer} from '../../server';
import initApollo from '../../server/apollo';
import filterProps from '../../utils/filterProps';
import {type PaintingResponse} from '../resolvers';

let server: Server;
let findExecMock: () => Promise<IPainting[]>;

beforeAll(async () => {
  const apolloServer = await initApollo();
  server = await initServer(apolloServer);
});

beforeEach(() => {
  setupMongooseMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  await server.stop();
});

describe('E2E: Testing successful Painting Queries from "/graphql"', () => {
  it('should respond with a list of Paintings', async () => {
    const keys = '_id,name,author,year,url'.split(',');
    const queryData = {
      query: `#graphql
      query GetPaintings {
        getPaintings {
          message
          result {
            _id
            name
            author
            year
            url
          }
        }
      }`,
    };

    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const response: Record<string, PaintingResponse> = reply.body.data;
    const expected: Partial<PaintingResponse> = {
      message: 'Listing 4 Paintings',
      result: getPaintings().map(filterProps(keys)),
    };

    expect(response).toEqual({getPaintings: expected});
    expect(Painting.find).toHaveBeenCalledTimes(1);
  });

  it('should respond with the first 2 Paintings', async () => {
    const keys = '_id,name,author'.split(',');
    const queryData = {
      query: `#graphql
      query GetPaintings($limit: Int) {
        getPaintings(limit: $limit) {
          message
          result {
            _id
            name
            author
          }
        }
      }`,
      variables: {
        limit: 2,
      },
    };

    const paintings = getPaintings(0, 2);
    findExecMock = () => Promise.resolve(paintings);
    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const response: Record<string, PaintingResponse> = reply.body.data;
    const expected: Partial<PaintingResponse> = {
      message: 'Listing 2 Paintings',
      result: paintings.map(filterProps(keys)),
    };

    expect(response).toEqual({getPaintings: expected});
    expect(Painting.find).toHaveBeenCalledTimes(1);
  });

  it('should respond with the Painting by its Id', async () => {
    const keys = '_id,name,author,year,url'.split(',');
    const queryData = {
      query: `#graphql
      query GetPaintingById($paintingId: String!) {
        getPaintingById(id: $paintingId) {
          message
          result {
            _id
            name
            author
            year
            url
          }
        }
      }`,
      variables: {
        paintingId: '64c4279c0d801e7604113a10',
      },
    };

    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const response: Record<string, PaintingResponse> = reply.body.data;
    const expected: Partial<PaintingResponse> = {
      message: 'Painting found',
      result: filterProps<IPainting>(keys)(getPaintings()[0]),
    };

    expect(response).toEqual({getPaintingById: expected});
    expect(Painting.findById).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------

describe('E2E: Testing failed Painting Queries from "/graphql"', () => {
  it('should get a null Painting when the Id does not exist', async () => {
    jest.spyOn(Painting, 'findById').mockResolvedValueOnce(null);

    const queryData = {
      query: `#graphql
      query GetPaintingById($paintingId: String!) {
        getPaintingById(id: $paintingId) {
          message
          success
        }
      }`,
      variables: {
        paintingId: 'f4c4279c0d801e7604113a10',
      },
    };

    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const response: Record<string, PaintingResponse> = reply.body.data;
    const expected: Partial<PaintingResponse> = {
      message: 'Painting not found',
      success: false,
    };

    expect(response).toEqual({getPaintingById: expected});
    expect(Painting.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw INTERNAL_SERVER_ERROR error', async () => {
    const queryData = {
      query: `#graphql
      query GetPaintings {
        getPaintings {
          message
        }
      }`,
    };

    jest.spyOn(Painting, 'find').mockImplementation(() => {
      throw new Error('connect ECONNREFUSED');
    });

    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const data = reply.body.data;
    const [error] = reply.body.errors;

    expect(data).toStrictEqual({getPaintings: null});
    expect(error.extensions.code).toBe('INTERNAL_SERVER_ERROR');
    expect(error.message).toBe('connect ECONNREFUSED');
    expect(error.locations).toBeDefined();
    expect(error.path).toBeDefined();
  });
});

// ---------------------------------

function setupMongooseMocks() {
  findExecMock = () => Promise.resolve(paintingsMock);
  jest.spyOn(Painting, 'findById').mockResolvedValue(paintingsMock[0]);
  jest.spyOn(Painting, 'find').mockImplementation(() => {
    return {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockImplementation(findExecMock),
    } as never;
  });
}

function getPaintings(start?: number, total?: number): IPainting[] {
  const paintings: IPainting[] = paintingsMock;
  if (start == null) {
    start = 0;
  }
  if (total == null) {
    return [...paintings];
  }
  return paintings.slice(start, total);
}
