import type {Request, ResponseToolkit} from '@hapi/hapi';

function healthRoutes() {
  return [
    {
      method: 'GET',
      path: '/healthz',
      handler: (request: Request, reply: ResponseToolkit) => {
        const healthStatus = {
          db: 'MongoDB is OK',
          server: 'Node Hapi is OK',
        };
        return reply.response(healthStatus).code(200);
      },
    },
    {
      method: 'GET',
      path: '/healthcheck',
      handler: (request: Request, reply: ResponseToolkit) => {
        const healthStatus = {
          db: 'MongoDB is OK',
          server: 'Node Hapi is OK',
        };
        return reply.response(healthStatus).code(200);
      },
    },
  ];
}

export default healthRoutes;
