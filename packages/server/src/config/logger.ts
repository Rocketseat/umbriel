import { LoggerOptions, format, transports } from 'winston';
import { MongoDB } from 'winston-mongodb';

import mongoConfig from '@config/mongo';

const mongoUserPass = mongoConfig.username
  ? `${mongoConfig.username}:${mongoConfig.password}@`
  : '';

interface LoggerConfig {
  driver: 'winston';

  config: {
    winston: LoggerOptions;
  };
}

export default {
  driver: 'winston',

  config: {
    winston: {
      format: format.combine(format.colorize(), format.simple()),
      transports: [
        new transports.Console({
          level: 'info',
        }),
        new MongoDB({
          level: 'warn',
          db: `mongodb://${mongoUserPass}${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`,
          collection: 'logs',
          options: {
            useUnifiedTopology: true,
          },
        }),
      ],
    },
  },
} as LoggerConfig;
