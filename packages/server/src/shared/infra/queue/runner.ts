import 'dotenv/config';
import 'reflect-metadata';
import * as Sentry from '@sentry/node';
import sentryConfig from '@config/sentry';

import { container } from 'tsyringe';

import '@shared/adapters';
import '@shared/infra/mongoose/connection';

import ProcessQueueService from '@modules/messages/services/ProcessQueueService';

Sentry.init({ dsn: sentryConfig.dsn });

const processQueue = container.resolve(ProcessQueueService);

processQueue.execute();

console.log('⚗‎‎  Processing mail sending queue!');
