import env from 'dotenv';

env.config();

const config = {
  app: {
    host: process.env.APP_HOST,
    port: process.env.APP_PORT,
  },
};

export default config;
