import jwt, {type JwtPayload} from 'jsonwebtoken';

import config from '../../server/config';
import createToken from '../createToken';

const {jwtPrivateKey, jwtExpiryTime} = config.app;

describe('Testing successful createToken()', () => {
  it('should return a string JWT token when passed a valid IUser object', () => {
    const user: Partial<IUser> = {
      _id: '123',
      email: 'test@example.com',
    };
    const token = createToken(user);
    expect(typeof token).toBe('string');
  });

  // JWT token contains the userId and email of the user.
  it('should contain the userId and email of the user in the JWT token', () => {
    const user: Partial<IUser> = {
      _id: '123',
      email: 'test@example.com',
    };
    const token = createToken(user);
    const decodedToken = jwt.verify(token, jwtPrivateKey) as JwtPayload;
    expect(decodedToken.userId).toBe(user._id);
    expect(decodedToken.email).toBe(user.email);
  });

  // JWT token has an expiration time set by the jwtExpiryTime value.
  it('should have an expiration time set by the jwtExpiryTime value in the JWT token', () => {
    const user: Partial<IUser> = {
      _id: '123',
      email: 'test@example.com',
    };
    const token = createToken(user);
    const decodedToken = jwt.verify(token, jwtPrivateKey) as JwtPayload;
    const currentTime = Math.floor(Date.now() / 1000);
    const expiryTime = currentTime + parseInt(jwtExpiryTime);
    expect(decodedToken.exp).toBeGreaterThanOrEqual(expiryTime);
  });
});

describe('Testing failed createToken()', () => {
  const jwtPrivateKeyOriginal = config.app.jwtPrivateKey;

  afterAll(() => {
    config.app.jwtPrivateKey = jwtPrivateKeyOriginal;
  });

  it('should throw an error if "secretOrPrivateKey" is not set', () => {
    config.app.jwtPrivateKey = undefined;
    const user: Partial<IUser> = {
      _id: '123',
      email: 'test@example.com',
    };
    expect(() => {
      createToken(user);
    }).toThrow('secretOrPrivateKey must have a value');
  });
});
