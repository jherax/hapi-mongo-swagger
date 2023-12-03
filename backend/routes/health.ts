import type {ReqRefDefaults, ServerRoute} from '@hapi/hapi';

import healthCheckHandler from '../handlers/healthCheckHandler';

const pluginsOptions = {
  'hapi-rate-limit': {
    enabled: true,
    userPathLimit: 5,
  },
};

function healthRoutes(): ServerRoute<ReqRefDefaults>[] {
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
