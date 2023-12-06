import type {Request, ResponseObject, ResponseToolkit} from '@hapi/hapi';

import Painting from '../models/Painting';
import messages from '../server/messages';
import {sendError, sendSuccess} from '../server/responses';

export const getAllPaintingsHandler = async (
  request: Request,
  reply: ResponseToolkit,
) => {
  const page = +(request.params.page || request.query.page || 1);
  const limit = +(request.query.limit || 10);
  const startIndex = (page - 1) * limit;
  try {
    const data = await Painting.find()
      .skip(startIndex)
      .limit(limit)
      .lean() // tells Mongoose to skip hydrating the result documents.
      .exec(); // execute the query.
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
    const {name, author, year, url} = request.payload as IPainting;
    const validated = request.preResponses.validated as ResponseObject;
    if (validated.statusCode !== 200) {
      return validated;
    }
    const painting = new Painting({name, author, year, url});
    const data = await painting.save();
    return sendSuccess<IPainting>(reply, messages.SUCCESSFUL_ADDED, data);
  } catch (error) {
    return sendError(reply, error);
  }
};
