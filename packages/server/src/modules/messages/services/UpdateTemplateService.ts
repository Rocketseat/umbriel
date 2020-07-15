import Template, {
  TemplateDocument,
  TemplateAttributes,
} from '@modules/messages/infra/mongoose/schemas/Template';

import Service from '@shared/core/Service';

interface Request {
  id: string;
  data: TemplateAttributes;
}

type Response = TemplateDocument;

class UpdateTemplateService implements Service<Request, Response> {
  async execute({ id, data }: Request): Promise<Response> {
    const template = await Template.findByIdAndUpdate(id, data, { new: true });

    if (!template) {
      throw new Error('Template not found');
    }

    return template;
  }
}

export default UpdateTemplateService;
