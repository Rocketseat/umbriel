import { NodeOptions } from '@sentry/node';

type SentryConfig = NodeOptions;

export default {
  dsn: process.env.SENTRY_DSN,
} as SentryConfig;
