import type {
  ReqRefDefaults,
  Request,
  ResponseToolkit,
  ServerRoute,
} from '@hapi/hapi';

function sandboxRoutes(): ServerRoute<ReqRefDefaults>[] {
  const env = process.env.NODE_ENV;
  if (env === 'prod') {
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
