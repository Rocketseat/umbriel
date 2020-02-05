import Queue from 'bull';
import redisConfig from '@config/redis';
import MessageData from '@services/structures/MessageData';

export interface MailJobData {
  to: string;
  messageData: MessageData;
}

const MailQueue = new Queue('mail', {
  limiter: {
    max: 90,
    duration: 1000,
  },
  redis: redisConfig,
});

export default MailQueue;
