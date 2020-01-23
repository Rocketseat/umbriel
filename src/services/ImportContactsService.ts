import { Readable } from 'stream';

import Tag from '@schemas/Tag';
import Contact from '@schemas/Contact';

import parseCSVAsync from '../utils/parseCSVAsync';

class ImportContactsService {
  async run(contactsFileStream: Readable, tags: string[]): Promise<void> {
    const emails = await parseCSVAsync(contactsFileStream);

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

    await Promise.all(
      emails.map(email =>
        Contact.findOneAndUpdate(
          { email },
          { $addToSet: { tags: tagsIds } },
          { upsert: true },
        ),
      ),
    );
  }
}

export default ImportContactsService;
