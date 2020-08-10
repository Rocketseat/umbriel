import { container } from 'tsyringe';

import Contact from '@modules/contacts/infra/mongoose/schemas/Contact';
import Tag from '@modules/contacts/infra/mongoose/schemas/Tag';
import Message from '@modules/messages/infra/mongoose/schemas/Message';
import SendMessageService from '@modules/messages/services/SendMessageService';

import MongoMock from '@shared/tests/MongoMock';

import Recipient from '../infra/mongoose/schemas/Recipient';

describe('Send Message', () => {
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

  it('should create a job inside the queue for each recipients email', async () => {
    const add = jest.fn();

    container.register('QueueProvider', {
      useValue: {
        add,
      },
    });

    const sendMessage = container.resolve(SendMessageService);

    const tags = await Tag.create([
      { title: 'Students' },
      { title: 'Class A' },
    ]);

    const tagsIds = tags.map((tag: { _id: string }) => tag._id);

    await Contact.create({
      email: 'diego@rocketseat.com.br',
      tags: tagsIds,
    });

    await Contact.create({
      email: 'cleiton@rocketseat.com.br',
      tags: tagsIds,
    });

    await Contact.create({
      email: 'robson@rocketseat.com.br',
      tags: tagsIds,
    });

    await Contact.create({
      email: 'unsubcribed@rocketseat.com.br',
      subscribed: false,
      tags: tagsIds,
    });

    const message = await Message.create({
      subject: 'Test',
      body: '<p>Test</p>',
      finalBody: '<p>Test</p>',
      tags: tagsIds,
    });

    await sendMessage.execute(message._id);

    expect(add).toHaveBeenCalledWith([
      {
        contact: expect.objectContaining({
          email: 'diego@rocketseat.com.br',
        }),
        message: expect.objectContaining({
          _id: message._id,
        }),
      },
      {
        contact: expect.objectContaining({
          email: 'cleiton@rocketseat.com.br',
        }),
        message: expect.objectContaining({
          _id: message._id,
        }),
      },
      {
        contact: expect.objectContaining({
          email: 'robson@rocketseat.com.br',
        }),
        message: expect.objectContaining({
          _id: message._id,
        }),
      },
    ]);
  });
});
