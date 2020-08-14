import Contact from '@modules/contacts/infra/mongoose/schemas/Contact';
import Tag from '@modules/contacts/infra/mongoose/schemas/Tag';

import Service from '@shared/core/Service';

interface Request {
  integrationUserId: string;
  integrationTeamId: string;
}

class AddContactInTeamService implements Service<Request, void> {
  async execute({
    integrationUserId,
    integrationTeamId,
  }: Request): Promise<void> {
    const existentUser = await Contact.findOne({
      integrationId: integrationUserId,
    });
    const existentTeam = await Tag.findOne({
      integrationId: integrationTeamId,
    });

    if (!existentUser) {
      throw new Error('User not found');
    }
    if (!existentTeam) {
      throw new Error('Team not found');
    }

    try {
      await Contact.findOneAndUpdate(
        { integrationId: integrationUserId },
        { $addToSet: { tags: existentTeam._id } },
        { upsert: true },
      );
    } catch (err) {
      throw new Error(
        'Unable to remove the user from the team, please try again later.',
      );
    }
  }
}

export default AddContactInTeamService;
