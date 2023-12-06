import type {Request, ResponseToolkit} from '@hapi/hapi';

import messages from '../server/messages';
import {sendError} from '../server/responses';

export default function paintingValidator(
  request: Request,
  reply: ResponseToolkit,
) {
  const errorMessages: string[] = [];
  const {name, author, year, url} = request.payload as IPainting;

  if (!name?.length) {
    errorMessages.push('- Painting must have a name');
  }

  if (!author?.length) {
    errorMessages.push('- Painting must have an author');
  }

  if (!year?.length) {
    errorMessages.push('- Painting must have a creation year');
  }

  if (url) {
    try {
      new URL(url);
    } catch (err) {
      errorMessages.push('- The Painting URL is not valid');
    }
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
