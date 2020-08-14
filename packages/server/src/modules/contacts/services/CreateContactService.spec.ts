import Contact from '@modules/contacts/infra/mongoose/schemas/Contact';
import Tag from '@modules/contacts/infra/mongoose/schemas/Tag';
import CreateContactsService from '@modules/contacts/services/CreateContactService';

import MongoMock from '@shared/tests/MongoMock';

describe('Creating contact', () => {
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

  it('should be able to create new contacts', async () => {
    const createContacts = new CreateContactsService();

    await createContacts.execute({
      name: 'Diego',
      email: 'diego@rocketseat.com.br',
      teams: [
        { title: 'GoStack' },
        { title: 'LaunchBase', integrationId: 'test' },
      ],
    });

    const createdTags = await Tag.find({}).lean();

    expect(createdTags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'GoStack' }),
        expect.objectContaining({ title: 'LaunchBase', integrationId: 'test' }),
      ]),
    );

    const createdTagsIds = createdTags.map(tag => tag._id);

    const createdContacts = await Contact.find({}).lean();

    expect(createdContacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: 'diego@rocketseat.com.br',
          subscribed: true,
          tags: createdTagsIds,
        }),
      ]),
    );
  });
});
