import { injectable, inject } from 'tsyringe';

import * as Sentry from '@sentry/node';

import MessageJob from '@modules/messages/dtos/MessageJob';
import Message from '@modules/messages/infra/mongoose/schemas/Message';
import Recipient from '@modules/messages/infra/mongoose/schemas/Recipient';

import LoggerProvider from '@shared/adapters/models/LoggerProvider';
import MailProvider from '@shared/adapters/models/MailProvider';
import QueueProvider from '@shared/adapters/models/QueueProvider';
import Service from '@shared/core/Service';

@injectable()
class ProcessQueueService implements Service<void, void> {
  constructor(
    @inject('QueueProvider') private queueProvider: QueueProvider,
    @inject('MailProvider') private mailProvider: MailProvider,
    @inject('LoggerProvider') private loggerProvider: LoggerProvider,
  ) {}

  execute(): void {
    this.queueProvider.process(async job => {
      const { contact, message } = job.data as MessageJob;

      try {
        const messageBodyWithUnsubscribe = message.finalBody.replace(
          '{{ contact_id }}',
          contact._id,
        );

        await this.mailProvider.sendEmail({
          to: contact.email,
          from: {
            name: message.sender.name,
            email: message.sender.email,
          },
          subject: message.subject,
          body: messageBodyWithUnsubscribe,
        });

        await Promise.all([
          Message.findByIdAndUpdate(message._id, {
            $inc: { sentCount: 1 },
          }),

          Recipient.findOneAndUpdate(
            {
              message: message._id,
              contact: contact._id,
            },
            {
              $addToSet: {
                events: {
                  type: 'deliver',
                },
              },
            },
          ),
        ]);

        this.loggerProvider.log(
          'info',
          `[${message.subject}] Sent message to ${contact.email}`,
        );
      } catch (err) {
        if (process.env.NODE_ENV === 'production') {
          Sentry.captureException(err);
        }

        console.log(err);

        this.loggerProvider.log(
          'error',
          `[${message.subject}] Failed to send message to ${contact.email}`,
        );

        throw err;
      }
    });
  }
}

export default ProcessQueueService;
