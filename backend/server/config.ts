import env from 'dotenv';
import path from 'path';

env.config();

const config = {
  app: {
    host: process.env.APP_HOST,
    port: process.env.APP_PORT,
    public: path.join(process.cwd(), '/backend/public'),
    logLevel: process.env.LOG_LEVEL || 'info',
    maxRequests: +(process.env.MAX_REQUESTS_PER_WINDOW || 100),
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_INIT_USERNAME,
    password: process.env.DB_INIT_PASSWORD,
  },
};

export default config;
