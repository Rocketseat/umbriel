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

    const existentTags = await Tag.find({
      title: {
        $in: tags,
      },
    });

    const existentTagsTitles = existentTags.map(tag => tag.title);

    const newTagsData = tags
      .filter(tag => !existentTagsTitles.includes(tag))
      .map(tag => ({ title: tag }));

    const createdTags = await Tag.create(newTagsData);
    const tagsIds = createdTags.map(tag => tag._id);

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
