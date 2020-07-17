import { Readable } from 'stream';

import Contact from '@modules/contacts/infra/mongoose/schemas/Contact';
import Tag from '@modules/contacts/infra/mongoose/schemas/Tag';
import ImportContactsService from '@modules/contacts/services/ImportContactsService';

import MongoMock from '@shared/tests/MongoMock';

describe('Import Contacts', () => {
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
    const contactsFileStream = Readable.from([
      'diego@rocketseat.com.br\n',
      'robson@rocketseat.com.br\n',
      'cleiton@rocketseat.com.br\n',
    ]);

    const importContacts = new ImportContactsService();

    await importContacts.execute({
      contactsFileStream,
      tags: ['Students', 'Class A'],
    });

    const createdTags = await Tag.find({}).lean();

    expect(createdTags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Students' }),
        expect.objectContaining({ title: 'Class A' }),
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
        expect.objectContaining({
          email: 'robson@rocketseat.com.br',
          subscribed: true,
          tags: createdTagsIds,
        }),
        expect.objectContaining({
          email: 'cleiton@rocketseat.com.br',
          subscribed: true,
          tags: createdTagsIds,
        }),
      ]),
    );
  });

  it('should not recreate tags that already exists', async () => {
    const contactsFileStream = Readable.from([
      'diego@rocketseat.com.br\n',
      'robson@rocketseat.com.br\n',
      'cleiton@rocketseat.com.br\n',
    ]);

    const importContacts = new ImportContactsService();

    await Tag.create({ title: 'Students' });

    await importContacts.execute({
      contactsFileStream,
      tags: ['Students', 'Class A'],
    });

    const createdTags = await Tag.find({}).lean();

    expect(createdTags).toEqual([
      expect.objectContaining({ title: 'Students' }),
      expect.objectContaining({ title: 'Class A' }),
    ]);
  });

  it('should not recreate contacts that already exists', async () => {
    const contactsFileStream = Readable.from([
      'diego@rocketseat.com.br\n',
      'robson@rocketseat.com.br\n',
      'cleiton@rocketseat.com.br\n',
    ]);

    const importContacts = new ImportContactsService();

    const tag = await Tag.create({ title: 'Students' });
    await Contact.create({ email: 'diego@rocketseat.com.br', tags: [tag._id] });

    await importContacts.execute({ contactsFileStream, tags: ['Class A'] });

    const contacts = await Contact.find({
      email: 'diego@rocketseat.com.br',
    })
      .populate('tags')
      .lean();

    expect(contacts.length).toBe(1);
    expect(contacts[0].tags).toEqual([
      expect.objectContaining({ title: 'Students' }),
      expect.objectContaining({ title: 'Class A' }),
    ]);
  });

  it('should keep existent tags when no tags needs to be created', async () => {
    const contactsFileStream = Readable.from([
      'diego@rocketseat.com.br\n',
      'robson@rocketseat.com.br\n',
      'cleiton@rocketseat.com.br\n',
    ]);

    const importContacts = new ImportContactsService();

    await Tag.create({ title: 'Students' });

    await importContacts.execute({ contactsFileStream, tags: ['Students'] });

    const contacts = await Contact.find({
      email: 'diego@rocketseat.com.br',
    })
      .populate('tags')
      .lean();

    expect(contacts.length).toBe(1);
    expect(contacts[0].tags).toEqual([
      expect.objectContaining({ title: 'Students' }),
    ]);
  });
});
