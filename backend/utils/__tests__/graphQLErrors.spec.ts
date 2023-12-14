import {GraphQLError} from 'graphql';

import graphQLErrors from '../graphQLErrors';

describe('Testing graphQLErrors', () => {
  it('should return a new GraphQLError instance when expired() method is called', () => {
    const result = graphQLErrors.expired();
    expect(result).toBeInstanceOf(GraphQLError);
    expect(result.message).toBe('jwt expired');
    expect(result.extensions).toEqual({
      code: 'UNAUTHENTICATED',
      http: {
        status: 401,
      },
    });
  });

  it('should return a new GraphQLError instance when unauthenticated() method is called', () => {
    const result = graphQLErrors.unauthenticated();
    expect(result).toBeInstanceOf(GraphQLError);
    expect(result.message).toBe('jwt required');
    expect(result.extensions).toEqual({
      code: 'UNAUTHENTICATED',
      http: {
        status: 401,
      },
    });
  });
});
