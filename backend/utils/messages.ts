// Also, you can use the Boom library to set HTTP-friendly error objects
// import Boom from 'boom'

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
    code: 400,
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
    message: 'Required parameter missing',
    success: false,
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: 'Something unexpected happened',
    success: false,
  },
};

export default messages;
