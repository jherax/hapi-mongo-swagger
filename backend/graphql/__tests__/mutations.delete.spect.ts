import '../../__mocks__/apollo';

import type {Server} from '@hapi/hapi';
import {agent as request} from 'supertest';

import paintingsMock from '../../__mocks__/paintings.json';
import {type PaintingResponse} from '../../graphql/resolvers';
import Painting from '../../models/Painting';
import {initServer} from '../../server';
import initApollo from '../../server/apollo';

let server: Server;

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

describe('E2E: Testing successful "deletePainting" mutation from "/graphql"', () => {
  it('should delete a Painting by its Id', async () => {
    const queryData = {
      query: `#graphql
      mutation DeletePainting($paintingId: String!) {
        deletePainting(id: $paintingId) {
          message
        }
      }`,
      variables: {
        paintingId: '65733864f82a63f5ee390f70',
      },
    };

    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const response: Record<string, PaintingResponse> = reply.body.data;
    const expected: Partial<PaintingResponse> = {
      message: 'Painting deleted',
    };

    expect(response).toEqual({deletePainting: expected});
    expect(Painting.deleteOne).toHaveBeenCalledTimes(1);
  });
});

describe('E2E: Testing failed "deletePainting" mutation from "/graphql"', () => {
  it('should not call "deleteOne" method if Painting does not exist', async () => {
    const queryData = {
      query: `#graphql
      mutation DeletePainting($paintingId: String!) {
        deletePainting(id: $paintingId) {
          message
        }
      }`,
      variables: {
        paintingId: '6f733864f82a63f5ee390f7f',
      },
    };

    jest.spyOn(Painting, 'findById').mockResolvedValue(null);
    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const response: Record<string, PaintingResponse> = reply.body.data;
    const expected: Partial<PaintingResponse> = {
      message: `Painting with id ${queryData.variables.paintingId} does not exist`,
    };

    expect(response).toEqual({deletePainting: expected});
    expect(Painting.deleteOne).toHaveBeenCalledTimes(0);
    expect(Painting.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw BAD_USER_INPUT code', async () => {
    const queryData = {
      query: `#graphql
      mutation DeletePainting($paintingId: String!) {
        deletePainting(id: $paintingId) {
          message
        }
      }`,
    };

    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const [error] = reply.body.errors;
    expect(error.extensions.code).toBe('BAD_USER_INPUT');
    expect(error.locations).toBeDefined();
    expect(error.message).toMatch(
      'Variable "$paintingId" of required type "String!" was not provided',
    );
  });
});

// ---------------------------------

function setupMongooseMocks() {
  jest
    .spyOn(Painting, 'deleteOne')
    .mockResolvedValue({deletedCount: 1, acknowledged: true});
  jest.spyOn(Painting, 'findById').mockResolvedValue(paintingsMock[2]);
}
