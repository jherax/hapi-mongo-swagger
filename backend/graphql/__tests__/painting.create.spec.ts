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
const expectedPainting = paintingsMock[1];

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

describe('E2E: Testing successful "createPainting" mutation from "/graphql"', () => {
  it('should create a new Painting', async () => {
    const keys = '_id,name,author,year,url,createdAt'.split(',');
    const queryData = {
      query: `#graphql
      mutation CreatePainting($paintingInput: CreatePaintingInput!) {
        createPainting(paintingInput: $paintingInput) {
          message
          result {
            _id
            name
            author
            year
            url
            createdAt
          }
        }
      }`,
      variables: {
        paintingInput: {
          name: '  The Starry Night ',
          author: 'Vincent van Gogh ',
          year: '1889 ',
          url: 'https://media.timeout.com/images/103166739/750/562/image.webp',
        },
      },
    };

    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const response: Record<string, PaintingResponse> = reply.body.data;
    const expected: Partial<PaintingResponse> = {
      message: 'New Painting added',
      result: filterProps<IPainting>(keys)(expectedPainting),
    };

    expect(response).toEqual({createPainting: expected});
    expect(Painting.prototype.save).toHaveBeenCalledTimes(1);
  });
});

describe('E2E: Testing failed "createPainting" mutation from "/graphql"', () => {
  it('should throw BAD_USER_INPUT code', async () => {
    const queryData = {
      query: `#graphql
      mutation CreatePainting($paintingInput: CreatePaintingInput!) {
        createPainting(paintingInput: $paintingInput) {
          message
          success
        }
      }`,
      variables: {
        paintingInput: {
          name: 'The Starry Night',
        },
      },
    };

    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const [error] = reply.body.errors;
    expect(error.extensions.code).toBe('BAD_USER_INPUT');
    expect(error.locations).toBeDefined();
    expect(error.message).toMatch(
      /Field "\w+" of required type "String!" was not provided/,
    );
  });
});

// ---------------------------------

function setupMongooseMocks() {
  jest.spyOn(Painting.prototype, 'save').mockResolvedValue(expectedPainting);
}
