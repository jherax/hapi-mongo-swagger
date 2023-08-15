/**
 * import Boom from '@hapi/boom'
 *
 * You can use the Boom library to set HTTP-friendly error objects
 * @see https://hapi.dev/module/boom/api/?v=10.0.1#http-4xx-errors
 */

const messages = {
  // SUCCESSFUL MESSAGES
  SUCCESSFUL_LOGIN: {
    code: 200,
    message: 'Successfully logged in',
    success: true,
  },
  SUCCESSFUL_DELETE: {
    code: 200,
    message: 'Successfully deleted',
    success: true,
  },
  SUCCESSFUL_UPDATE: {
    code: 200,
    message: 'Successfully updated',
    success: true,
  },
  SUCCESSFUL_ADDED: {
    code: 200, // 201
    message: 'Successfully created',
    success: true,
  },
  SUCCESSFUL: {
    code: 200,
    success: true,
    message: 'Successfully completed',
  },
  ALREADY_EXIST: {
    code: 200, // 409
    success: true,
    message: 'Already exists',
  },
  // ERROR MESSAGES
  BAD_REQUEST: {
    code: 400,
    message: 'Bad request. Please try again with valid parameters',
    success: false,
  },
  AUTHENTICATION_FAILED: {
    code: 401,
    message: 'Authentication failed. Please login with valid credentials.',
    success: false,
  },
  UNAUTHORIZED: {
    code: 401,
    message: 'Your session has expired. Please login again',
    success: false,
  },
  FORBIDDEN: {
    code: 403,
    message: 'You are not authorized to complete this action',
    success: false,
  },
  NOT_FOUND: {
    code: 404,
    success: true,
    message: 'Requested API not found',
  },
  INCOMPLETE_REQUEST: {
    code: 422,
    message: 'Required parameters missing',
    success: false,
  },
  TOO_MANY_REQUESTS: {
    code: 429,
    message: 'Too Many Requests',
    success: false,
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: 'Something unexpected happened',
    success: false,
  },
  SERVICE_UNAVAILABLE: {
    code: 503,
    message: 'Service Unavailable',
    success: false,
  },
};

export default messages;
