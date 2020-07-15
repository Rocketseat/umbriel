import Template, {
  TemplateDocument,
} from '@modules/messages/infra/mongoose/schemas/Template';

import Service from '@shared/core/Service';

interface Request {
  search: string;
  page: number;
  per_page?: number;
}

type Response = {
  templates: TemplateDocument[];
  totalCount: number;
};

class SearchTemplatesService implements Service<Request, Response> {
  async execute({ search, page, per_page = 20 }: Request): Promise<Response> {
    const templates = await Template.find({
      title: new RegExp(`${search.toLowerCase()}`, 'i'),
    })
      .limit(per_page)
      .skip(per_page * (page - 1));

    const totalCount = await Template.estimatedDocumentCount();

    return { templates, totalCount };
  }
}

export default SearchTemplatesService;
