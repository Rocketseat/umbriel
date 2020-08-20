import Contact from '@modules/contacts/infra/mongoose/schemas/Contact';
import Tag from '@modules/contacts/infra/mongoose/schemas/Tag';

import MongoMock from '@shared/tests/MongoMock';

import Segment from '../infra/mongoose/schemas/Segment';
import GetRecipientsFromTags from './GetRecipientsFromTags';

describe('Count Recipients', () => {
  beforeAll(async () => {
    await MongoMock.connect();
  });

  afterAll(async () => {
    await MongoMock.disconnect();
  });

  beforeEach(async () => {
    await Tag.deleteMany({});
    await Contact.deleteMany({});
    await Segment.deleteMany({});
  });

  it('must be possible to count the number of recipients using the tags', async () => {
    const tags = await Tag.create([
      { title: 'Gostack' },
      { title: 'Launchbase' },
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

    const getRecipientsFromTags = new GetRecipientsFromTags();

    const recipients = await getRecipientsFromTags.execute({
      tags: tagsIds,
      segments: [],
      excludeTags: [],
    });

    expect(recipients.length).toEqual(2);
  });

  it('must be possible to count the number of recipients using segments', async () => {
    const tags = await Tag.create([
      { title: 'Gostack' },
      { title: 'Launchbase' },
    ]);

    const tagsIds = tags.map((tag: { _id: string }) => tag._id);

    const createSegment = await Segment.create({
      title: 'TestUmbriel',
      tags: tagsIds,
    });

    const segment: string[] = [createSegment._id];

    await Contact.create({
      email: 'diego@rocketseat.com.br',
      tags: tagsIds,
    });

    await Contact.create({
      email: 'cleiton@rocketseat.com.br',
      tags: tagsIds,
    });

    const getRecipientsFromTags = new GetRecipientsFromTags();

    const recipients = await getRecipientsFromTags.execute({
      tags: [],
      segments: segment,
      excludeTags: [],
    });

    expect(recipients.length).toEqual(2);
  });

  it('must be possible to count the number of recipients using segments and tags', async () => {
    const gostack = await Tag.create({ title: 'GoStack' });
    const launchbase = await Tag.create({ title: 'LaunchBase' });
    const starter = await Tag.create({ title: 'Starter' });

    const createSegment = await Segment.create({
      title: 'TestUmbriel',
      tags: [String(gostack._id), String(launchbase._id)],
    });

    await Contact.create({
      email: 'diego@rocketseat.com.br',
      tags: [String(gostack._id)],
    });

    await Contact.create({
      email: 'cleiton@rocketseat.com.br',
      tags: [String(launchbase._id)],
    });

    await Contact.create({
      email: 'gustavo@rocketseat.com.br',
      tags: [String(starter._id)],
    });

    const segment: string[] = [String(createSegment._id)];
    const tag: string[] = [String(starter._id)];

    const getRecipientsFromTags = new GetRecipientsFromTags();

    const recipients = await getRecipientsFromTags.execute({
      tags: tag,
      segments: segment,
      excludeTags: [],
    });

    expect(recipients.length).toEqual(3);
  });

  it('must be possible to count the number of recipients in the segment, even excluding any segment tags', async () => {
    const gostack = await Tag.create({ title: 'GoStack' });
    const launchbase = await Tag.create({ title: 'LaunchBase' });

    const createSegment = await Segment.create({
      title: 'TestUmbriel',
      tags: [String(gostack._id), String(launchbase._id)],
    });

    await Contact.create({
      email: 'diego@rocketseat.com.br',
      tags: [String(gostack._id)],
    });

    await Contact.create({
      email: 'cleiton@rocketseat.com.br',
      tags: [String(launchbase._id)],
    });

    const segment: string[] = [String(createSegment._id)];
    const exclude: string[] = [String(gostack._id)];

    const getRecipientsFromTags = new GetRecipientsFromTags();

    const recipients = await getRecipientsFromTags.execute({
      tags: [],
      segments: segment,
      excludeTags: exclude,
    });

    expect(recipients.length).toEqual(1);
  });
});
