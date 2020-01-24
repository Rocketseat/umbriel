import mongoose from 'mongoose';
import { Readable } from 'stream';

import Contact from '@schemas/Contact';
import Tag from '@schemas/Tag';

import ImportContactsService from './ImportContactsService';

jest.setTimeout(60000);

const FAKE = {
  CONTACTS: ['fake1@hotmail.com', 'fake2@gmail.com', 'fake3@yahoo.com'],
  TAGS: ['Students', 'Class A'],
};

async function executeService() {
  const contactsFileStream = Readable.from(FAKE.CONTACTS.map(e => e + '\n'));

  const importContacts = new ImportContactsService();
  await importContacts.run(contactsFileStream, FAKE.TAGS);
}

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
    // Execute service
    await executeService();

    // Expect all tags are created
    const createdTags = await Tag.find({}).lean();
    expect(createdTags).toEqual(
      FAKE.TAGS.map(title => expect.objectContaining({ title })),
    );

    // Expect all contacts are created
    const createdTagsIds = createdTags.map(tag => tag._id);
    const createdContacts = await Contact.find({}).lean();
    expect(createdContacts).toEqual(
      FAKE.CONTACTS.map(email =>
        expect.objectContaining({
          email,
          tags: createdTagsIds,
        }),
      ),
    );
  });

  it('should not recreate tags that already exists', async () => {
    // Create a premature tag
    await Tag.create({ title: FAKE.TAGS[0] });

    // Execute service
    await executeService();

    // Expect not duplicate tag
    const createdTags = await Tag.find({}).lean();
    expect(createdTags).toEqual(
      FAKE.TAGS.map(title => expect.objectContaining({ title })),
    );
  });

  it('should not recreate contacts that already exists', async () => {
    // Create a premature contact with a tag
    const tag = await Tag.create({ title: 'Students ' });
    await Contact.create({ email: FAKE.CONTACTS[0], tags: [tag._id] });

    // Execute service
    await executeService();

    const contacts = await Contact.find({ email: FAKE.CONTACTS[0] })
      .populate('tags')
      .lean();

    // Expect not duplicate contact
    expect(contacts.length).toBe(1);

    // Expect not duplicate tag in contact and a new tag added
    expect(contacts[0].tags).toEqual(
      FAKE.TAGS.map(title => expect.objectContaining({ title })),
    );
  });
});
