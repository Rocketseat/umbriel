import Service from '@shared/core/Service';

import Contact, { ContactDocument } from '../infra/mongoose/schemas/Contact';

interface Request {
  tags: string[];
}

type Response = ContactDocument[];

class GetRecipientsFromTags implements Service<Request, Response> {
  async execute({ tags }: Request): Promise<Response> {
    const recipients = await Contact.findByTags(tags, {
      subscribed: true,
    });

    return recipients;
  }
}

export default GetRecipientsFromTags;
