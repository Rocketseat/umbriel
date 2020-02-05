import 'dotenv/config';
import MailQueue, { MailJobData } from '@queues/MailQueue';
import SendMessageToRecipientService from '@services/SendMessageToRecipientService';

MailQueue.process(async job => {
  const { to, messageData } = job.data as MailJobData;

  const sendMessageToRecipient = new SendMessageToRecipientService();

  await sendMessageToRecipient.run(to, messageData);
});
