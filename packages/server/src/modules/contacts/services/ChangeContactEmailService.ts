import Contact from '@modules/contacts/infra/mongoose/schemas/Contact';

import Service from '@shared/core/Service';

interface Request {
  integrationUserId: string;
  email: string;
}

class ChangeContactEmailService implements Service<Request, void> {
  async execute({ integrationUserId, email }: Request): Promise<void> {
    const existentUser = await Contact.findOne({
      integrationId: integrationUserId,
    });

    if (!existentUser) {
      throw new Error('User not found');
    }

    try {
      await Contact.findOneAndUpdate(
        { integrationId: integrationUserId },
        { email },
      );
    } catch (err) {
      throw new Error(
        'It was not possible to update the email, please try again later.',
      );
    }
  }
}

export default ChangeContactEmailService;
