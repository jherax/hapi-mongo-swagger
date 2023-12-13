import jwt from 'jsonwebtoken';

import config from '../server/config';
import graphQLErrors from './graphQLErrors';

export default function verifyJwt(token: string): boolean {
  if (!token) {
    return false;
  }
  try {
    const user = jwt.verify(token, config.app.jwtPrivateKey) as IUserJwt;
    return !!user;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw graphQLErrors.expired();
    }
    throw error;
  }
}
