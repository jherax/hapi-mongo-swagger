import type {ReqRefDefaults, ServerRoute} from '@hapi/hapi';

import {
  getAllPaintingsHandler,
  savePaintingHandler,
} from '../handlers/paintingHandler';
import paintingValidator from '../handlers/paintingValidator';

const v1 = '/api/v1';

const pluginsOptions = {
  'hapi-rate-limit': {
    enabled: true,
  },
};

/**
 * Handle cookies via `server.state()`
 * @see https://hapi.dev/tutorials/cookies/
 */

function paintingRoutes(): ServerRoute<ReqRefDefaults>[] {
  return [
    {
      method: 'GET',
      path: `${v1}/paintings`,
      options: {
        handler: getAllPaintingsHandler,
        plugins: pluginsOptions,
      },
    },
    {
      method: 'GET',
      path: `${v1}/paintings/{page}`,
      options: {
        handler: getAllPaintingsHandler,
        plugins: pluginsOptions,
      },
    },
    {
      method: 'POST',
      path: `${v1}/paintings`,
      options: {
        pre: [{assign: 'validated', method: paintingValidator}],
        handler: savePaintingHandler,
      },
    },
  ];
}

export default paintingRoutes;
