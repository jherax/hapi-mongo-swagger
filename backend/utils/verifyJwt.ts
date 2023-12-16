import jwt from 'jsonwebtoken';

import config from '../server/config';
import graphQLErrors from './graphQLErrors';

export default function verifyJwt(token: string): IUserJwt {
  if (!token) {
    return {authenticated: false};
  }
  try {
    const user = jwt.verify(token, config.app.jwtPrivateKey) as IUserJwt;
    return {authenticated: true, ...user};
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw graphQLErrors.expired();
    }
    throw error;
  }
}
