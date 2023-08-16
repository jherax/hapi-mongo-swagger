import type {ReqRefDefaults, ServerRoute} from '@hapi/hapi';

import {
  getAllPaintingsHandler,
  savePaintingHandler,
} from '../handlers/paintingHandler';

const v1 = '/api/v1';

const pluginsOptions = {
  'hapi-rate-limit': {
    enabled: true,
  },
};

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
      method: 'POST',
      path: `${v1}/paintings`,
      handler: savePaintingHandler,
    },
  ];
}

export default paintingRoutes;
