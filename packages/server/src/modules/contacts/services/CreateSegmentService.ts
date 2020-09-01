import Segment from '@modules/contacts/infra/mongoose/schemas/Segment';
import Tag from '@modules/contacts/infra/mongoose/schemas/Tag';

import Service from '@shared/core/Service';

interface Request {
  id?: string;
  title: string;
  tags: string[];
}

class CreateSegmentService implements Service<Request, void> {
  async execute({ title, tags, id }: Request): Promise<void> {
    const existentTags = await Tag.find({
      title: {
        $in: tags,
      },
    });

    if (!existentTags) {
      throw new Error('Tag not found');
    }

    const existentTagsIds = existentTags.map(tag => tag._id);

    if (id) {
      await Segment.findByIdAndUpdate(
        id,
        { title, tags: existentTagsIds },
        { upsert: true },
      );
    }

    await Segment.create({ title, tags: existentTagsIds }, { upsert: true });
  }
}

export default CreateSegmentService;
