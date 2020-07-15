import Service from '@shared/core/Service';

import Contact from '@modules/contacts/infra/mongoose/schemas/Contact';

class DeleteContactService implements Service<string, void> {
  async execute(id: string): Promise<void> {
    const contact = await Contact.findById(id);

    if (!contact) {
      throw new Error('Message not found');
    }

    await contact.remove();
  }
}

export default DeleteContactService;
