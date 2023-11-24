import type {Request, ResponseToolkit} from '@hapi/hapi';

import HealthCheck from '../models/HealthCheck';
import messages from '../server/messages';
import {sendError, sendSuccess} from '../server/responses';

const healthCheckHandler = async (request: Request, reply: ResponseToolkit) => {
  const healthStatus = {
    server: {isUp: true},
    database: {isUp: false},
  };

  const findEvent = {event: 'check'};
  const updateOptions = {
    new: true,
    upsert: true,
  };

  try {
    const data: IHealthCheck = await Promise.resolve(
      HealthCheck.findOneAndUpdate(findEvent, findEvent, updateOptions),
    );
    if (data) {
      healthStatus.database.isUp = true;
      return sendSuccess(reply, messages.SUCCESSFUL, healthStatus);
    } else {
      return sendSuccess(reply, messages.SERVICE_UNAVAILABLE, healthStatus);
    }
  } catch (error) {
    return sendError(reply, error);
  }
};

export default healthCheckHandler;
