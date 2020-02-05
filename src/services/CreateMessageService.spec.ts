import MongoMock from '@utils/tests/MongoMock';
import QueueMock from '@utils/tests/QueueMock';

import CreateMessageService from '@services/CreateMessageService';

import Message from '@schemas/Message';
import Contact from '@schemas/Contact';
import Tag from '@schemas/Tag';

describe('Create Message', () => {
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
  });

  it('should be able to create new message', async () => {
    const sendMessage = new CreateMessageService();

    const tags = await Tag.create([
      { title: 'Students' },
      { title: 'Class A' },
    ]);

    const tagsIds = tags.map(tag => tag._id);

    const messageData = {
      subject: 'Hello World',
      body: '<p>Just testing the email</p>',
    };

    await sendMessage.run(messageData, tagsIds);

    const message = await Message.findOne(messageData);

    expect(message).toBeTruthy();
  });

  it('should create a job inside the queue for each recipients email', async () => {
    const sendMessage = new CreateMessageService();

    const tags = await Tag.create([
      { title: 'Students' },
      { title: 'Class A' },
    ]);

    const tagsIds = tags.map(tag => tag._id);

    const contacts = [
      { email: 'diego@rocketseat.com.br', tags: tagsIds },
      { email: 'cleiton@rocketseat.com.br', tags: tagsIds },
      { email: 'robson@rocketseat.com.br', tags: tagsIds },
    ];

    await Contact.create(contacts);

    const messageData = {
      subject: 'Hello World',
      body: '<p>Just testing the email</p>',
    };

    await sendMessage.run(messageData, tagsIds);

    expect(QueueMock.add).toHaveBeenCalledWith({
      to: contacts[0].email,
      messageData,
    });

    expect(QueueMock.add).toHaveBeenCalledWith({
      to: contacts[1].email,
      messageData,
    });

    expect(QueueMock.add).toHaveBeenCalledWith({
      to: contacts[0].email,
      messageData,
    });
  });
});
