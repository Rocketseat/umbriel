import Tag from '@modules/contacts/infra/mongoose/schemas/Tag';

import Service from '@shared/core/Service';

interface Request {
  integrationTeamId?: string;
  title: string;
}

class ChangeTagTitleService implements Service<Request, void> {
  async execute({ integrationTeamId, title }: Request): Promise<void> {
    const existentTeam = await Tag.findOne({
      integrationId: integrationTeamId,
    });

    if (!existentTeam) {
      throw new Error('Team not found');
    }

    try {
      await Tag.findOneAndUpdate(
        { integrationId: integrationTeamId },
        { title },
      );
    } catch (err) {
      throw new Error('Unable to update the title, please try again later.');
    }
  }
}

export default ChangeTagTitleService;
