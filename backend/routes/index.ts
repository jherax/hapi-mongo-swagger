import type {Server} from '@hapi/hapi';

import healthRoutes from './health';
import paintingRoutes from './paintings';

export default function registerRoutes(server: Server) {
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: function (request, h) {
        // https://hapi.dev/tutorials/servingfiles/
        return h.file('README.html');
      },
    },
    ...healthRoutes(),
    ...paintingRoutes(),
  ]);
}
