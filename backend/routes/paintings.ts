import type {Request, ResponseToolkit} from '@hapi/hapi';

import Painting from '../models/Painting';
import messages from '../utils/messages';
import {sendError, sendSuccess} from '../utils/responses';

const v1 = '/api/v1';

function paintingRoutes() {
  return [
    {
      method: 'GET',
      path: `${v1}/paintings`,
      handler: async (request: Request, reply: ResponseToolkit) => {
        try {
          const data = await Painting.find().lean().exec();
          return sendSuccess<IPainting[]>(reply, messages.SUCCESSFUL, data);
        } catch (error) {
          return sendError(reply, error);
        }
      },
    },
    {
      method: 'POST',
      path: `${v1}/paintings`,
      handler: async (request: Request, reply: ResponseToolkit) => {
        try {
          const {name, url, techniques} = request.payload as JSONObject;
          const painting = new Painting({
            name,
            url,
            techniques,
          });
          const data = await painting.save();
          return sendSuccess<IPainting>(reply, messages.SUCCESSFUL_ADDED, data);
        } catch (error) {
          return sendError(reply, error);
        }
      },
    },
  ];
}

export default paintingRoutes;
