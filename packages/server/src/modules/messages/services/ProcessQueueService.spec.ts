import { container } from 'tsyringe';

import Contact from '@modules/contacts/infra/mongoose/schemas/Contact';
import Tag from '@modules/contacts/infra/mongoose/schemas/Tag';
import Message from '@modules/messages/infra/mongoose/schemas/Message';
import Recipient from '@modules/messages/infra/mongoose/schemas/Recipient';
import ProcessQueueService from '@modules/messages/services/ProcessQueueService';

import MongoMock from '@shared/tests/MongoMock';

describe('Add Recipients to Queue', () => {
  beforeAll(async () => {
    await MongoMock.connect();
  });

  afterAll(async () => {
    await MongoMock.disconnect();
  });

  beforeEach(async () => {
    await Tag.deleteMany({});
    await Message.deleteMany({});
    await Contact.deleteMany({});
    await Recipient.deleteMany({});
  });

  it('should send mail to all recipients when processing the queue', async () => {
    const flushPromises = (): Promise<void> => new Promise(setImmediate);

    const tag = await Tag.create({
      title: 'Students',
    });

    const contact = await Contact.create({
      email: 'test@example.com',
      tags: [tag._id],
    });

    const message = await Message.create({
      sender: {
        name: 'John Doe',
        email: 'john@doe.com',
      },
      subject: 'Test message',
      body: 'Message body',
      finalBody: 'Message body',
      tags: [tag._id],
    });

    await Recipient.create({
      recipientEmail: contact.email,
      contact: contact._id,
      message: message._id,
    });

    const job = {
      data: { contact, message },
    };

    const process = async (processFunction: Function): Promise<void> => {
      await processFunction(job);
    };

    const sendEmail = jest.fn();

    container.register('QueueProvider', {
      useValue: {
        process,
      },
    });

    container.register('MailProvider', {
      useValue: {
        sendEmail,
      },
    });

    const processQueue = container.resolve(ProcessQueueService);

    processQueue.execute();

    await flushPromises();

    const updatedMessage = await Message.findById(message._id);

    const recipient = await Recipient.findOne({
      message: message._id,
      contact: contact._id,
    });

    expect(sendEmail).toHaveBeenCalledWith({
      from: {
        name: 'John Doe',
        email: 'john@doe.com',
      },
      to: contact.email,
      subject: message.subject,
      body: message.finalBody,
    });

    expect(updatedMessage?.sentCount).toEqual(1);

    expect(recipient?.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'deliver',
        }),
      ]),
    );
  });
});
