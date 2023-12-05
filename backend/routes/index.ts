import type {Request, ResponseToolkit, Server} from '@hapi/hapi';

import healthRoutes from './health';
import paintingRoutes from './paintings';
import sandboxRoutes from './sandbox';

export default function registerRoutes(server: Server) {
  server.route([
    {
      method: 'GET',
      path: '/',
      /** @see https://hapi.dev/tutorials/servingfiles/ */
      handler: function (request: Request, reply: ResponseToolkit) {
        return reply.file('README.html');
      },
    },
    ...sandboxRoutes(),
    ...healthRoutes(),
    ...paintingRoutes(),
  ]);
}
