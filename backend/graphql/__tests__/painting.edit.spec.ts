import '../../__mocks__/apollo';

import type {Server} from '@hapi/hapi';
import {agent as request} from 'supertest';

import paintingsMock from '../../__mocks__/paintings.json';
import Painting from '../../models/Painting';
import {initServer} from '../../server';
import initApollo from '../../server/apollo';
import filterProps from '../../utils/filterProps';
import verifyJwt from '../../utils/verifyJwt';
import {type PaintingResponse} from '../resolvers';

jest.mock('../../utils/verifyJwt');

const verifyJwtMock = verifyJwt as jest.MockedFunction<typeof verifyJwt>;
const expectedPainting: IPainting = paintingsMock[3];
let server: Server;

beforeAll(async () => {
  const apolloServer = await initApollo();
  server = await initServer(apolloServer);
});

beforeEach(() => {
  verifyJwtMock.mockReturnValue(true);
  setupMongooseMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

afterAll(async () => {
  await server.stop();
});

describe('E2E: Testing successful "editPainting" mutation from "/graphql"', () => {
  it('should modify an existing Painting', async () => {
    const keys = '_id,name,author,year,url'.split(',');
    const queryData = {
      query: `#graphql
      mutation EditPainting($paintingId: String!, $paintingInput: EditPaintingInput!) {
        editPainting(id: $paintingId, paintingInput: $paintingInput) {
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
        paintingId: '6573389cf82a63f5ee390f72',
        paintingInput: {
          year: ' 1485 ',
        },
      },
    };

    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const response: Record<string, PaintingResponse> = reply.body.data;
    const expected: Partial<PaintingResponse> = {
      message: 'Painting edited',
      result: {
        ...filterProps<IPainting>(keys)(expectedPainting),
        year: '1485',
      },
    };

    expect(response).toEqual({editPainting: expected});
    expect(Painting.findById).toHaveBeenCalledTimes(1);
    expect(Painting.updateOne).toHaveBeenCalledTimes(1);
  });
});

describe('E2E: Testing failed "editPainting" mutation from "/graphql"', () => {
  it('should not call "updateOne" method if Painting does not exist', async () => {
    const queryData = {
      query: `#graphql
      mutation EditPainting($paintingId: String!, $paintingInput: EditPaintingInput!) {
        editPainting(id: $paintingId, paintingInput: $paintingInput) {
          message
          success
        }
      }`,
      variables: {
        paintingId: '6f733864f82a63f5ee390f7f',
        paintingInput: {
          year: ' 1485 ',
        },
      },
    };

    jest.spyOn(Painting, 'findById').mockResolvedValue(null);
    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const response: Record<string, PaintingResponse> = reply.body.data;
    const expected: Partial<PaintingResponse> = {
      message: `Painting with id ${queryData.variables.paintingId} does not exist`,
      success: false,
    };

    expect(response).toEqual({editPainting: expected});
    expect(Painting.updateOne).toHaveBeenCalledTimes(0);
    expect(Painting.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw BAD_USER_INPUT code', async () => {
    const queryData = {
      query: `#graphql
      mutation EditPainting($paintingId: String!, $paintingInput: EditPaintingInput!) {
        editPainting(id: $paintingId, paintingInput: $paintingInput) {
          message
        }
      }`,
      variables: {
        paintingId: '6573389cf82a63f5ee390f72',
      },
    };

    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const [error] = reply.body.errors;
    expect(error.extensions.code).toBe('BAD_USER_INPUT');
    expect(error.locations).toBeDefined();
    expect(error.message).toMatch(
      'Variable "$paintingInput" of required type "EditPaintingInput!" was not provided',
    );
  });
});

// ---------------------------------

function setupMongooseMocks() {
  jest
    .spyOn(Painting, 'updateOne')
    .mockResolvedValue({acknowledged: true, modifiedCount: 1} as never);
  jest.spyOn(Painting, 'findById').mockResolvedValue(expectedPainting);
}
