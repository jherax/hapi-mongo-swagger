import type {Request, ResponseToolkit, Server} from '@hapi/hapi';

export default function registerRoutes(server: Server) {
  server.route({
    method: 'GET',
    path: '/',
    handler: (request: Request, response: ResponseToolkit) => {
      return `<h1>GraphQL API with Nodejs, Swagger and MongoDB</h1>`;
    },
  });
}
