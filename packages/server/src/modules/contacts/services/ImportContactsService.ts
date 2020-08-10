import csvParse from 'csv-parse';
import { Readable } from 'stream';

import Contact from '@modules/contacts/infra/mongoose/schemas/Contact';
import Tag from '@modules/contacts/infra/mongoose/schemas/Tag';

import Service from '@shared/core/Service';

interface Request {
  contactsFileStream: Readable;
  tags: string[];
}

class ImportContactsService implements Service<Request, void> {
  async execute({ contactsFileStream, tags }: Request): Promise<void> {
    const parsers = csvParse({
      delimiter: ';',
    });

    const parseCSV = contactsFileStream.pipe(parsers);

    const existentTags = await Tag.find({
      title: {
        $in: tags,
      },
    });

    const existentTagsTitles: string[] = existentTags.map(tag => tag.title);
    const existentTagsIds: string[] = existentTags.map(tag => tag._id);

    const newTagsData = tags
      .filter(tag => !existentTagsTitles.includes(tag))
      .map(tag => ({ title: tag }));

    const createdTags = await Tag.create(newTagsData);
    let createdTagsIds: string[] = createdTags?.map(
      (tag: { _id: string }) => tag._id,
    );

    if (!createdTagsIds) {
      createdTagsIds = [];
    }

    const tagsIds = [...existentTagsIds, ...createdTagsIds];

    parseCSV.on('data', async line => {
      const [email] = line;

      if (!email) return;

      await Contact.findOneAndUpdate(
        { email, subscribed: true },
        { $addToSet: { tags: tagsIds } },
        { upsert: true },
      );
    });

    await new Promise(resolve => parseCSV.on('end', resolve));
  }
}

export default ImportContactsService;
