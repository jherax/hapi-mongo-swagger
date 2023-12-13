import {GraphQLError} from 'graphql';

/**
 * @see https://www.apollographql.com/docs/apollo-server/data/errors/
 */
const graphQLErrors = {
  expired: () => {
    return new GraphQLError('jwt expired', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: {
          status: 401,
        },
      },
    });
  },

  unauthenticated: () => {
    return new GraphQLError('jwt required', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: {
          status: 401,
        },
      },
    });
  },
};

export default graphQLErrors;
