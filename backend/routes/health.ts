import type {Request, ResponseToolkit} from '@hapi/hapi';

import messages from '../utils/messages';
import {sendSuccess} from '../utils/responses';

const healthStatus = {
  server: {isUp: true},
  database: {isUp: true},
};

const pluginsOptions = {
  'hapi-rate-limit': {
    enabled: true,
    userPathLimit: 3,
  },
};

const healthCheckHandler = (request: Request, reply: ResponseToolkit) => {
  return sendSuccess(reply, messages.SUCCESSFUL, healthStatus);
};

function healthRoutes() {
  return [
    {
      method: 'GET',
      path: '/healthcheck',
      options: {
        handler: healthCheckHandler,
        plugins: pluginsOptions,
      },
    },
    {
      method: 'GET',
      path: '/healthz',
      options: {
        handler: healthCheckHandler,
        plugins: pluginsOptions,
      },
    },
  ];
}

export default healthRoutes;
