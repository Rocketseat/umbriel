import Tag, { TagDocument } from '@modules/contacts/infra/mongoose/schemas/Tag';

import Service from '@shared/core/Service';

interface Request {
  search: string;
}

type Response = TagDocument[];

class SearchTagsService implements Service<Request, Response> {
  async execute({ search }: Request): Promise<Response> {
    const tags = await Tag.find({
      title: new RegExp(`${search.toLowerCase()}`, 'i'),
    });

    return tags;
  }
}

export default SearchTagsService;
