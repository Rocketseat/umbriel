import { container } from 'tsyringe';

import mailConfig from '@config/mail';
import loggerConfig from '@config/logger';
import queueConfig from '@config/queue';
import redisConfig from '@config/redis';

import MailProvider from './models/MailProvider';
import LoggerProvider from './models/LoggerProvider';
import QueueProvider from './models/QueueProvider';

import providers from './providers';

const Mail = providers.mail[mailConfig.driver];
const Queue = providers.queue[queueConfig.driver];
const Logger = providers.logger[loggerConfig.driver];

container.registerInstance<MailProvider>(
  'MailProvider',
  new Mail(mailConfig.config[mailConfig.driver]),
);

container.registerInstance<QueueProvider>(
  'QueueProvider',
  new Queue({
    ...mailConfig.queue,
    redis: redisConfig,
  }),
);

container.registerInstance<LoggerProvider>(
  'LoggerProvider',
  new Logger(loggerConfig.config[loggerConfig.driver]),
);
