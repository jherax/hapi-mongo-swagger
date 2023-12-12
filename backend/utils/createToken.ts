import jwt from 'jsonwebtoken';

import config from '../server/config';

export default function createToken(user: Partial<IUser>): string {
  return jwt.sign(
    {userId: user._id, email: user.email},
    config.app.jwtPrivateKey,
    {expiresIn: config.app.jwtExpiryTime},
  );
}
