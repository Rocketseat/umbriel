import { injectable, inject } from 'tsyringe';

import Contact from '@modules/contacts/infra/mongoose/schemas/Contact';
import Message, {
  MessageDocument,
} from '@modules/messages/infra/mongoose/schemas/Message';
import Recipient from '@modules/messages/infra/mongoose/schemas/Recipient';

import LoggerProvider from '@shared/adapters/models/LoggerProvider';
import QueueProvider from '@shared/adapters/models/QueueProvider';
import Service from '@shared/core/Service';

type Request = string;
type Response = MessageDocument;

@injectable()
class SendMessageService implements Service<Request, Response> {
  constructor(
    @inject('QueueProvider') private queueProvider: QueueProvider,
    @inject('LoggerProvider') private loggerProvider: LoggerProvider,
  ) {}

  async execute(id: Request): Promise<Response> {
    const message = await Message.findById(id);

    if (!message) {
      throw new Error('Message not found');
    }

    const contacts = await Contact.findByTags(message.tags, {
      subscribed: true,
    });

    if (message.sentAt) {
      throw new Error('Message already sent');
    }

    const recipientsData = contacts.map(contact => ({
      recipientEmail: contact.email,
      message: message._id,
      contact: contact._id,
    }));

    const result = await Recipient.collection.insertMany(recipientsData, {
      ordered: false,
    });

    this.loggerProvider.log(
      'warn',
      `[${message.subject}] ${result.insertedCount} recipients added to database.`,
      {
        messageId: message._id,
      },
    );

    const queueJobs = contacts.map(contact => {
      return {
        contact,
        message,
      };
    });

    await this.queueProvider.add(queueJobs);

    this.loggerProvider.log(
      'warn',
      `[${message.subject}] Recipients added to Queue`,
      {
        messageId: message._id,
      },
    );

    message.sentAt = new Date();

    await message.save();

    return message;
  }
}

export default SendMessageService;
