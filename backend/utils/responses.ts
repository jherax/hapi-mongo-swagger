import type {ResponseToolkit} from '@hapi/hapi';

import messages from '../utils/messages';

/** @see https://futurestud.io/tutorials/hapi-how-to-set-response-status-code */

export function sendSuccess<T = JSONObject>(
  reply: ResponseToolkit,
  serverMsg: ServerResponse,
  data?: NonNullable<T>,
) {
  serverMsg.data = data || {};
  return reply.response(serverMsg).code(serverMsg.code);
}

export function sendError(reply: ResponseToolkit, err: Error) {
  const errorCode = (err as any).code ?? 500;
  const msgKey = Object.keys(messages).find(key => {
    return messages[key].code === errorCode;
  });
  const serverMsg: ServerResponse = messages[msgKey];
  serverMsg.error = {
    message: err.message,
    stack: err.stack,
  };
  return reply.response(serverMsg).code(errorCode);
}
