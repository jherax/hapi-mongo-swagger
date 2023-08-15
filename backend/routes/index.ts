import type {Server} from '@hapi/hapi';

import healthRoutes from './health';
import paintingRoutes from './paintings';

export default function registerRoutes(server: Server) {
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: () => {
        return `<h3>GraphQL API with Nodejs, Swagger and MongoDB</h3>`;
      },
    },
    ...healthRoutes(),
    ...paintingRoutes(),
  ]);
}
