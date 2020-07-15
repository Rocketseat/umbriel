import { QueueOptions } from 'bull';

interface QueueConfig {
  driver: 'bull';

  config: {
    bull: QueueOptions;
  };
}

export default {
  driver: 'bull',

  config: {
    bull: {},
  },
} as QueueConfig;
