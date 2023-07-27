import env from 'dotenv';

env.config();

const config = {
  app: {
    host: process.env.APP_HOST,
    port: process.env.APP_PORT,
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
