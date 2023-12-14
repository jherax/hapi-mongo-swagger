import createToken from '../createToken';
import verifyJwt from '../verifyJwt';

describe('Testing verifyJwt()', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should return true when a valid JWT token is passed as argument', () => {
    const user: Partial<IUser> = {
      _id: '123',
      email: 'test@example.com',
    };
    const token = createToken(user);
    const result = verifyJwt(token);
    expect(result).toBe(true);
  });

  it('should return false when no token is passed as argument', () => {
    expect(verifyJwt('')).toBe(false);
    expect(verifyJwt(null)).toBe(false);
    expect(verifyJwt(undefined)).toBe(false);
  });

  it('should throw error when an expired token is passed as argument', () => {
    const user: Partial<IUser> = {
      _id: '123',
      email: 'test@example.com',
    };

    const oneHour = 3600000;
    const futureDate = new Date().getTime() + oneHour;
    const token = createToken(user);

    jest.spyOn(Date, 'now').mockImplementation(() => futureDate);

    expect(() => {
      verifyJwt(token);
    }).toThrow('jwt expired');
  });

  it('should throw error when an invalid token is passed as argument', () => {
    expect(() => {
      verifyJwt('invalidToken');
    }).toThrow('jwt malformed');
  });
});
