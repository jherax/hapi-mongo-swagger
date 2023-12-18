import type {ReqRefDefaults, ServerRoute} from '@hapi/hapi';

import {
  getAllPaintingsHandler,
  savePaintingHandler,
} from '../handlers/paintingHandler';
import paintingValidator from '../handlers/paintingValidator';

// TODO: Add Joi for schema and route validation
// https://github.com/z0mt3c/hapi-swaggered#example
const v1 = '/api/v1';

const pluginsOptions = {
  'hapi-rate-limit': {
    enabled: true,
  },
};

/**
 * Handle cookies via `server.state()`
 * @see https://hapi.dev/tutorials/cookies/
 *
 * Route options:
 * @see https://hapi.dev/api/?v=21.3.2#route-options
 */

function paintingRoutes(): ServerRoute<ReqRefDefaults>[] {
  return [
    {
      method: 'GET',
      path: `${v1}/paintings`,
      options: {
        handler: getAllPaintingsHandler,
        plugins: pluginsOptions,
        description: 'GET: List all paintings',
        tags: ['api', 'paintings'],
        auth: false,
      },
    },
    {
      method: 'GET',
      path: `${v1}/paintings/{page}`,
      options: {
        handler: getAllPaintingsHandler,
        plugins: pluginsOptions,
        description: 'GET: List all paintings by /page',
        tags: ['api', 'paintings'],
        auth: false,
      },
    },
    {
      method: 'POST',
      path: `${v1}/paintings`,
      options: {
        pre: [{assign: 'validated', method: paintingValidator}],
        handler: savePaintingHandler,
        description: 'POST: Creates a new painting',
        tags: ['api', 'paintings'],
        auth: false,
      },
    },
  ];
}

export default paintingRoutes;
