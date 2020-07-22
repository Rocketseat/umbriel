import Contact, {
  ContactDocument,
} from '@modules/contacts/infra/mongoose/schemas/Contact';

import Service from '@shared/core/Service';

interface Request {
  contact_id: string;
  subscribed: boolean;
}

class ChangeContactSubscriptionStatusService
  implements Service<Request, ContactDocument> {
  async execute({ contact_id, subscribed }: Request): Promise<ContactDocument> {
    const contact = await Contact.findById(contact_id);

    if (!contact) {
      throw new Error('Contact not found.');
    }

    await contact.updateOne({
      subscribed,
    });

    return contact;
  }
}

export default ChangeContactSubscriptionStatusService;
