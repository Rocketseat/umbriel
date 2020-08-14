import Contact from '@modules/contacts/infra/mongoose/schemas/Contact';
import Tag from '@modules/contacts/infra/mongoose/schemas/Tag';

import MongoMock from '@shared/tests/MongoMock';

import ChangeContactSubscriptionStatusService from './ChangeContactSubscriptionStatusService';

describe('Change Contact Subscription Status', () => {
  beforeAll(async () => {
    await MongoMock.connect();
  });

  afterAll(async () => {
    await MongoMock.disconnect();
  });

  beforeEach(async () => {
    await Tag.deleteMany({});
    await Contact.deleteMany({});
  });

  it('should be able to import new contacts', async () => {
    const contact = await Contact.create({
      email: 'johndoe@example.com',
    });

    const changeContactSubscriptionStatus = new ChangeContactSubscriptionStatusService();

    await changeContactSubscriptionStatus.execute({
      contact_id: contact._id,
      subscribed: false,
    });

    const updatedContact = await Contact.findById(contact._id);

    expect(updatedContact?.subscribed).toBe(false);
  });
});
