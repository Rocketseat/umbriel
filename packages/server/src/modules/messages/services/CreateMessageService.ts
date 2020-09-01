/* eslint-disable no-param-reassign */
import Segment from '@modules/contacts/infra/mongoose/schemas/Segment';
import Message, {
  MessageDocument,
  MessageAttributes,
} from '@modules/messages/infra/mongoose/schemas/Message';

import Service from '@shared/core/Service';

interface Request {
  data: MessageAttributes;
  segmentsArray: string[];
  excludeTags: string[];
}

class CreateMessageService implements Service<Request, MessageDocument> {
  async execute({
    data,
    segmentsArray,
    excludeTags,
  }: Request): Promise<MessageDocument> {
    let tags: string[] = [];

    const segments = await Segment.find({
      _id: {
        $in: segmentsArray,
      },
    });

    if (!segments) {
      throw new Error('Segment not found');
    }

    segments.map(segment => segment.tags.map(tag => tags.push(tag)));
    data.tags.map((tag: string) => tags.push(tag));

    if (excludeTags.length !== 0) {
      tags = tags.filter(tag => !excludeTags.includes(String(tag)));
    }

    data.tags = tags;

    return Message.create(data);
  }
}

export default CreateMessageService;
