import mongoose from 'mongoose';
import { Readable } from 'stream';

import ImportContactsService from '@services/ImportContactsService';

import Contact from '@schemas/Contact';
import Tag from '@schemas/Tag';

describe('Import', () => {
  beforeAll(async () => {
    if (!process.env.MONGO_URL) {
      throw new Error('MongoDB server not initialized');
    }

    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Contact.deleteMany({});
    await Tag.deleteMany({});
  });

  it('should be able to import new contacts', async () => {
    const contactsFileStream = Readable.from([
      'diego@rocketseat.com.br\n',
      'robson@rocketseat.com.br\n',
      'cleiton@rocketseat.com.br\n',
    ]);

    const importContacts = new ImportContactsService();

    await importContacts.run(contactsFileStream, ['Students', 'Class A']);

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
          tags: createdTagsIds,
        }),
        expect.objectContaining({
          email: 'robson@rocketseat.com.br',
          tags: createdTagsIds,
        }),
        expect.objectContaining({
          email: 'cleiton@rocketseat.com.br',
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

    await importContacts.run(contactsFileStream, ['Students', 'Class A']);

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

    await importContacts.run(contactsFileStream, ['Class A']);

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
});
