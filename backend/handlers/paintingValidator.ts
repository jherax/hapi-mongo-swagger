import type {Request, ResponseToolkit} from '@hapi/hapi';

import messages from '../utils/messages';
import {sendError} from '../utils/responses';

export default function paintingValidator(
  request: Request,
  reply: ResponseToolkit,
) {
  const errorMessages: string[] = [];
  const {name, url, techniques} = request.payload as IPainting;

  if (!name?.length) {
    errorMessages.push('- Painting must have a name');
  }

  if (!url?.length) {
    errorMessages.push('- Painting url is not set');
  }

  if (!techniques?.length) {
    errorMessages.push('- Painting must have at least one technique');
  }

  if (errorMessages.length) {
    return sendError(reply, {
      code: messages.INCOMPLETE_REQUEST.statusCode,
      message: messages.INCOMPLETE_REQUEST.message,
      stack: ['There are errors in the body payload.']
        .concat(errorMessages)
        .join('\n'),
    });
  }

  return reply.continue;
}
