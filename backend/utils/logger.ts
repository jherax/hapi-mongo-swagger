import chalk from 'chalk';
import winston, {format as wformat} from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import config from '../server/config';

const levels = {
  error: chalk.red.bold,
  warn: chalk.yellow.bold,
  info: chalk.green.bold,
  debug: chalk.cyan.bold,
};

const logFormat = wformat.printf(args => {
  const {level, message, stack, timestamp} = args;
  const timeColor = chalk.gray(`[${timestamp}]`);
  const levelColor =
    level in levels ? levels[level](level.toUpperCase()) : 'LOG';
  return `${timeColor} [${levelColor}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: config.app.logLevel.toLowerCase(),
  format: wformat.combine(
    wformat.errors({stack: true}),
    wformat.timestamp(),
    wformat.json(),
  ),
  transports: [
    new winston.transports.Console({format: logFormat}),
    new DailyRotateFile({
      filename: 'logs/%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

export default logger;
