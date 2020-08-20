import Service from '@shared/core/Service';

import Contact, { ContactDocument } from '../infra/mongoose/schemas/Contact';
import Segment from '../infra/mongoose/schemas/Segment';

interface Request {
  tags: string[];
  segments: string[];
  excludeTags: string[];
}

type Response = ContactDocument[];

class GetRecipientsFromTags implements Service<Request, Response> {
  async execute({ tags, segments, excludeTags }: Request): Promise<Response> {
    let allTags: string[] = [];

    tags.forEach(tag => allTags.push(tag));

    if (segments.length !== 0) {
      const findSegments = await Segment.find({
        _id: {
          $in: segments,
        },
      });

      findSegments.forEach(segment =>
        segment.tags.forEach(tag => allTags.push(tag)),
      );
    }

    if (excludeTags.length !== 0) {
      allTags = allTags.filter(tag => !excludeTags.includes(String(tag)));

      const recipients = await Contact.findByTags(allTags, {
        subscribed: true,
      });

      return recipients;
    }

    const recipients = await Contact.findByTags(allTags, {
      subscribed: true,
    });

    return recipients;
  }
}

export default GetRecipientsFromTags;
