import type {Request, ResponseToolkit} from '@hapi/hapi';

import Painting from '../models/Painting';

const v1 = '/api/v1';

function paintingRoutes() {
  return [
    {
      method: 'GET',
      path: `${v1}/paintings`,
      handler: async () => {
        const data = await Painting.find().lean().exec();
        return data;
      },
    },
    {
      method: 'POST',
      path: `${v1}/paintings`,
      handler: (request: Request, reply: ResponseToolkit) => {
        const {name, url, techniques} = request.payload as JSONObject;
        const painting = new Painting({
          name,
          url,
          techniques,
        });
        return painting.save();
      },
    },
  ];
}

export default paintingRoutes;
