import Sender from '@modules/senders/infra/mongoose/schemas/Sender';
import CreateSenderService from '@modules/senders/services/CreateSenderService';

import MongoMock from '@shared/tests/MongoMock';

describe('Create Sender', () => {
  beforeAll(async () => {
    await MongoMock.connect();
  });

  afterAll(async () => {
    await MongoMock.disconnect();
  });

  beforeEach(async () => {
    await Sender.deleteMany({});
  });

  it('should be able to create new sender', async () => {
    const createTemplate = new CreateSenderService();

    const senderData = {
      name: 'John Doe',
      email: 'john@doe.com',
    };

    await createTemplate.execute({ data: senderData });

    const template = await Sender.findOne(senderData);

    expect(template).toBeTruthy();
  });

  it('should not be able to create duplicated sender', async () => {
    expect.assertions(1);

    const senderData = {
      name: 'John Doe',
      email: 'john@doe.com',
    };

    await Sender.create(senderData);

    try {
      const createSender = new CreateSenderService();

      await createSender.execute({ data: senderData });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });
});
