import env from 'dotenv';
import path from 'path';

env.config();

const config = {
  env: process.env.NODE_ENV || 'dev',
  app: {
    host: process.env.APP_HOST,
    port: process.env.APP_PORT,
    public: path.join(process.cwd(), '/backend/public'),
    logLevel: process.env.LOG_LEVEL || 'info',
    maxRequests: +(process.env.MAX_REQUESTS_PER_WINDOW || 100),
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
    jwtExpiryTime: process.env.JWT_EXPIRY_TIME,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_INIT_USERNAME,
    password: process.env.DB_INIT_PASSWORD,
  },
};

export const isProd = ['prod', 'production'].includes(config.env);

export default config;
