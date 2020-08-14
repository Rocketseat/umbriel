import Contact from '@modules/contacts/infra/mongoose/schemas/Contact';
import Tag from '@modules/contacts/infra/mongoose/schemas/Tag';

import Service from '@shared/core/Service';

interface Request {
  integrationUserId: string;
  integrationTeamId: string;
}

class RemoveContactTeamService implements Service<Request, void> {
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
      existentUser.tags = existentUser.tags.filter(
        tag => String(tag) !== String(existentTeam._id),
      );
      await existentUser.save();
    } catch (err) {
      throw new Error(
        'Unable to remove the user from the team, please try again later.',
      );
    }
  }
}

export default RemoveContactTeamService;
