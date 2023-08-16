import type {Request, ResponseToolkit} from '@hapi/hapi';

import Painting from '../models/Painting';
import messages from '../utils/messages';
import {sendError, sendSuccess} from '../utils/responses';

export const getAllPaintingsHandler = async (
  request: Request,
  reply: ResponseToolkit,
) => {
  try {
    const data = await Painting.find().lean().exec();
    return sendSuccess<IPainting[]>(reply, messages.SUCCESSFUL, data);
  } catch (error) {
    return sendError(reply, error);
  }
};

export const savePaintingHandler = async (
  request: Request,
  reply: ResponseToolkit,
) => {
  try {
    const {name, url, techniques} = request.payload as IPainting;
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
};
