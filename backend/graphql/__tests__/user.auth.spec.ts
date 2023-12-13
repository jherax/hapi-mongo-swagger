import '../../__mocks__/apollo';

import type {Server} from '@hapi/hapi';
import {agent as request} from 'supertest';

import usersMock from '../../__mocks__/users.json';
import User from '../../models/User';
import {initServer} from '../../server';
import initApollo from '../../server/apollo';
import createToken from '../../utils/createToken';
import filterProps from '../../utils/filterProps';
import {type UserResponse} from '../resolvers';

let server: Server;
const expectedUser: IUser = usersMock[2];

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

describe('E2E: Testing successful "login" mutation from "/graphql"', () => {
  it('should generate a valid token for the user', async () => {
    const keys = '_id,email,fullname,jwtoken'.split(',');
    const queryData = {
      query: `#graphql
      mutation LoginUser($input: LoginInput!) {
        login(input: $input) {
          message
          result {
            _id
            email
            fullname
            jwtoken
          }
        }
      }`,
      variables: {
        input: {
          email: 'bosch@domain.com',
          password: 'oV4opfzcPH4JUcB',
        },
      },
    };

    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const response: Record<string, UserResponse> = reply.body.data;
    const expected: Partial<UserResponse> = {
      message: 'Successfully logged in',
      result: {
        ...filterProps<IUser>(keys)(expectedUser),
        jwtoken: createToken(expectedUser),
      },
    };

    expect(response).toEqual({login: expected});
    expect(User.findOne).toHaveBeenCalledTimes(1);
  });
});

describe('E2E: Testing failed "login" mutation from "/graphql"', () => {
  it("should fail when the email and password don't match", async () => {
    const queryData = {
      query: `#graphql
      mutation LoginUser($input: LoginInput!) {
        login(input: $input) {
          message
          success
        }
      }`,
      variables: {
        input: {
          email: 'bosch@domain.com',
          password: 'not-valid-password',
        },
      },
    };

    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const response: Record<string, UserResponse> = reply.body.data;
    const expected: Partial<UserResponse> = {
      message: `Email and password don't match`,
      success: false,
    };

    expect(response).toEqual({login: expected});
    expect(User.findOne).toHaveBeenCalledTimes(1);
  });

  it('should throw BAD_USER_INPUT code', async () => {
    const queryData = {
      query: `#graphql
      mutation LoginUser($input: LoginInput!) {
        login(input: $input) {
          message
          success
        }
      }`,
      variables: {
        input: {
          email: 'bosch@domain.com',
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
      /Field "\w+" of required type "\w+!" was not provided/,
    );
  });
});

// ---------------------------------

function setupMongooseMocks() {
  jest.spyOn(User, 'findOne').mockResolvedValue(expectedUser);
}
