import type {
  ReqRefDefaults,
  Request,
  ResponseToolkit,
  ServerRoute,
} from '@hapi/hapi';

import {isProd} from '../server/config';

function sandboxRoutes(): ServerRoute<ReqRefDefaults>[] {
  if (isProd) {
    return [];
  }
  return [
    {
      method: 'GET',
      path: '/sandbox',
      /** @see https://www.apollographql.com/docs/graphos/explorer/sandbox/ */
      handler: function (request: Request, reply: ResponseToolkit) {
        return reply.file('sandbox/index.html');
      },
    },
  ];
}

export default sandboxRoutes;
