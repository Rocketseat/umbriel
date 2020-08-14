import Contact from '@modules/contacts/infra/mongoose/schemas/Contact';
import Tag from '@modules/contacts/infra/mongoose/schemas/Tag';

import Service from '@shared/core/Service';

export interface Team {
  title: string;
  integrationId?: string;
}

interface Request {
  name?: string;
  email: string;
  integrationUserId?: string;
  teams: Team[];
}

class CreateContactService implements Service<Request, void> {
  async execute({
    integrationUserId,
    name,
    email,
    teams,
  }: Request): Promise<void> {
    const teamsAsArray = teams.map(team => team.title);

    const existentTeams = await Tag.find({
      title: {
        $in: teamsAsArray,
      },
    });

    const existentTeamsTitles = existentTeams.map(team => team.title);
    const existentTeamsIds = existentTeams.map(team => team._id);

    const newTeamsData = teams.filter(
      team => !existentTeamsTitles.includes(team.title),
    );

    const createdTeams = await Tag.create(newTeamsData);

    let createdTeamsIds = createdTeams?.map(team => team._id);

    if (!createdTeamsIds) {
      createdTeamsIds = [];
    }

    const teamsIds = [...existentTeamsIds, ...createdTeamsIds];

    await Contact.findOneAndUpdate(
      { name, integrationId: integrationUserId, email, subscribed: true },
      { $addToSet: { tags: teamsIds } },
      { upsert: true },
    );
  }
}

export default CreateContactService;
