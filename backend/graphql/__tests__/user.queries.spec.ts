import '../../__mocks__/apollo';

import type {Server} from '@hapi/hapi';
import {agent as request} from 'supertest';

import usersMock from '../../__mocks__/users.json';
import User from '../../models/User';
import {initServer} from '../../server';
import initApollo from '../../server/apollo';
import filterProps from '../../utils/filterProps';
import {type UserResponse} from '../resolvers';

let server: Server;
let findExecMock: () => Promise<IUser[]>;

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

describe('E2E: Testing successful User Queries from "/graphql"', () => {
  it('should respond with a list of Users', async () => {
    const keys = '_id,email,password,fullname'.split(',');
    const queryData = {
      query: `#graphql
      query GetUsers {
        getUsers {
          message
          result {
            _id
            email
            password
            fullname
          }
        }
      }`,
    };

    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const response: Record<string, UserResponse> = reply.body.data;
    const expected: Partial<UserResponse> = {
      message: 'Listing 4 Users',
      result: getUsers().map(filterProps(keys)),
    };

    expect(reply.status).toBe(200);
    expect(response).toEqual({getUsers: expected});
    expect(User.find).toHaveBeenCalledTimes(1);
  });

  it('should respond with the first 2 Users', async () => {
    const keys = '_id,email,password,fullname'.split(',');
    const queryData = {
      query: `#graphql
      query GetUsersLimit($limit: Int, $page: Int) {
        getUsers(limit: $limit, page: $page) {
          message
          result {
            _id
            email
            password
            fullname
          }
        }
      }`,
      variables: {
        limit: 2,
      },
    };

    const users = getUsers(0, 2);
    findExecMock = () => Promise.resolve(users);
    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const response: Record<string, UserResponse> = reply.body.data;
    const expected: Partial<UserResponse> = {
      message: 'Listing 2 Users',
      result: users.map(filterProps(keys)),
    };

    expect(reply.status).toBe(200);
    expect(response).toEqual({getUsers: expected});
    expect(User.find).toHaveBeenCalledTimes(1);
  });

  it('should respond with the User by its Id', async () => {
    const keys = '_id,email,password,fullname,createdAt,updatedAt'.split(',');
    const queryData = {
      query: `#graphql
      query GetUserById($userId: String!) {
        getUserById(id: $userId) {
          message
          result {
            _id
            email
            password
            fullname
            createdAt
            updatedAt
          }
        }
      }`,
      variables: {
        userId: '6578c888fdc512cd9fb27aaf',
      },
    };

    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const response: Record<string, UserResponse> = reply.body.data;
    const expected: Partial<UserResponse> = {
      message: 'User found',
      result: filterProps<IUser>(keys)(getUsers()[0]),
    };

    expect(reply.status).toBe(200);
    expect(response).toEqual({getUserById: expected});
    expect(User.findById).toHaveBeenCalledTimes(1);
  });
});

describe('E2E: Testing failed User Queries from "/graphql"', () => {
  it('should throw INTERNAL_SERVER_ERROR error', async () => {
    const queryData = {
      query: `#graphql
    query GetUsers {
      getUsers {
        message
      }
    }`,
    };

    jest.spyOn(User, 'find').mockImplementation(() => {
      throw new Error('connect ECONNREFUSED');
    });

    const reply = await request(server.listener)
      .post('/graphql')
      .send(queryData);

    const data = reply.body.data;
    const [error] = reply.body.errors;

    expect(reply.status).toBe(500);
    expect(data).toStrictEqual({getUsers: null});
    expect(error.extensions.code).toBe('INTERNAL_SERVER_ERROR');
    expect(error.message).toBe('connect ECONNREFUSED');
    expect(error.locations).toBeDefined();
    expect(error.path).toBeDefined();
  });
});

// ---------------------------------

function setupMongooseMocks() {
  findExecMock = () => Promise.resolve(usersMock);
  jest.spyOn(User, 'findById').mockResolvedValue(usersMock[0]);
  jest.spyOn(User, 'find').mockImplementation(() => {
    return {
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockImplementation(findExecMock),
    } as never;
  });
}

function getUsers(start?: number, total?: number): IUser[] {
  const users: IUser[] = usersMock;
  if (start == null) {
    start = 0;
  }
  if (total == null) {
    return [...users];
  }
  return users.slice(start, total);
}
