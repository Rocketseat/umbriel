import Tag from '@modules/contacts/infra/mongoose/schemas/Tag';
import Message from '@modules/messages/infra/mongoose/schemas/Message';
import CreateMessageService from '@modules/messages/services/CreateMessageService';

import MongoMock from '@shared/tests/MongoMock';

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
  });

  it('should be able to create new message', async () => {
    const createMessage = new CreateMessageService();

    const tags = await Tag.create([
      { title: 'Students' },
      { title: 'Class A' },
    ]);

    const tagsIds: string[] = tags.map((tag: { _id: string }) => tag._id);

    const messageData = {
      sender: {
        name: 'John Doe',
        email: 'john@doe.com',
      },
      subject: 'Hello World',
      body: '<p>Just testing the email</p>',
      finalBody: '<p>Just testing the email</p>',
      tags: tagsIds,
    };

    await createMessage.execute({
      data: messageData,
    });

    const message = await Message.findOne(messageData);

    expect(message).toBeTruthy();
  });
});
