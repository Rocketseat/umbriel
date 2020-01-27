import { Readable } from 'stream';
import csvParse from 'csv-parse';

import Tag from '@schemas/Tag';
import Contact from '@schemas/Contact';

class ImportContactsService {
  async run(contactsFileStream: Readable, tags: string[]): Promise<void> {
    const parsers = csvParse({
      delimiter: ';',
    });

    const parseCSV = contactsFileStream.pipe(parsers);

    const uniqueTags = tags.filter((tag, index) => tags.indexOf(tag) === index);
    const existentTags = await Tag.find({
      title: {
        $in: uniqueTags,
      },
    });

    const existentTagsTitles = existentTags.map(tag => tag.title);
    const existentTagsIds = existentTags.map(tag => tag._id);

    const newTagsData = uniqueTags
      .filter(tag => !existentTagsTitles.includes(tag))
      .map(tag => ({ title: tag }));

    const createdTags = await Tag.create(newTagsData);
    const createdTagsIds = createdTags.map(tag => tag._id);

    const tagsIds = [...existentTagsIds, ...createdTagsIds];

    parseCSV.on('data', async line => {
      const [email] = line;

      await Contact.findOneAndUpdate(
        { email },
        { $addToSet: { tags: tagsIds } },
        { upsert: true },
      );
    });

    await new Promise(resolve => parseCSV.on('end', resolve));
  }
}

export default ImportContactsService;
