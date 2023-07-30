import type {Server} from '@hapi/hapi';

import healthRoutes from './health';
import paintingRoutes from './paintings';

export default function registerRoutes(server: Server) {
  server.route([
    {
      method: 'GET',
      path: '/',
      handler: () => {
        return `<h1>GraphQL API with Nodejs, Swagger and MongoDB</h1>`;
      },
    },
    ...healthRoutes(),
    ...paintingRoutes(),
  ]);
}
