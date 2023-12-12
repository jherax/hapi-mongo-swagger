import '../../__mocks__/apollo';

import type {Server} from '@hapi/hapi';
import {agent as request} from 'supertest';

import usersMock from '../../__mocks__/users.json';
import User from '../../models/User';
import {initServer} from '../../server';
import initApollo from '../../server/apollo';
import createToken from '../../utils/createToken';
import {type UserResponse} from '../resolvers';

let server: Server;
const expectedUser = usersMock[0];

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

describe('E2E: Testing successful "signup" mutation from "/graphql"', () => {
  it('should create a new User', async () => {
    const keys = '_id,email,fullname,jwtoken,createdAt'.split(',');
    const queryData = {
      query: `#graphql
      mutation SignupUser($input: SignupInput!) {
        signup(input: $input) {
          message
          result {
            _id
            email
            fullname
            jwtoken
            createdAt
          }
        }
      }`,
      variables: {
        input: {
          fullname: '  Pablo Picasso  ',
          email: 'pablo.picasso@domain.com',
          password: 'zqEgVcURzKmsm9h',
        },
      },
    };

    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const response: Record<string, UserResponse> = reply.body.data;
    const expected: Partial<UserResponse> = {
      message: 'New user created',
      result: {
        ...filterProps(keys, expectedUser),
        jwtoken: createToken(expectedUser),
      },
    };

    expect(response).toEqual({signup: expected});
    expect(User.prototype.save).toHaveBeenCalledTimes(1);
  });
});

describe('E2E: Testing failed "signup" mutation from "/graphql"', () => {
  it('should fail when the email already exists', async () => {
    const queryData = {
      query: `#graphql
      mutation SignupUser($input: SignupInput!) {
        signup(input: $input) {
          message
          success
        }
      }`,
      variables: {
        input: {
          fullname: 'Pablo Picasso',
          email: 'pablo.picasso@domain.com',
          password: 'zqEgVcURzKmsm9h',
        },
      },
    };

    jest.spyOn(User, 'findOne').mockResolvedValue(expectedUser);
    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const email = queryData.variables.input.email;
    const response: Record<string, UserResponse> = reply.body.data;
    const expected: Partial<UserResponse> = {
      message: `User with email '${email}' already exists`,
      success: false,
    };

    expect(response).toEqual({signup: expected});
    expect(User.findOne).toHaveBeenCalledWith({email});
    expect(User.prototype.save).not.toHaveBeenCalled();
  });

  it('should throw BAD_USER_INPUT code', async () => {
    const queryData = {
      query: `#graphql
      mutation SignupUser($input: SignupInput!) {
        signup(input: $input) {
          message
          success
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
      /Variable "\$input" of required type "\w+!" was not provided/,
    );
  });
});

// ---------------------------------

function setupMongooseMocks() {
  jest.spyOn(User, 'findOne').mockResolvedValue(null);
  jest.spyOn(User.prototype, 'save').mockResolvedValue(expectedUser);
}

function filterProps<T>(keys: string[], obj: T): T {
  const mapped = Object.create(null);
  keys.forEach(prop => {
    mapped[prop] = obj[prop];
  });
  return mapped;
}
