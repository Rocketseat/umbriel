import Template, {
  TemplateDocument,
} from '@modules/messages/infra/mongoose/schemas/Template';

import Service from '@shared/core/Service';

type Request = string;

type Response = TemplateDocument;

class GetTemplateService implements Service<Request, Response> {
  async execute(id: Request): Promise<Response> {
    const template = await Template.findById(id);

    if (!template) {
      throw new Error('Template not found.');
    }

    return template;
  }
}

export default GetTemplateService;
