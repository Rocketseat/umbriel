import Template, {
  TemplateAttributes,
  TemplateDocument,
} from '@modules/messages/infra/mongoose/schemas/Template';

import Service from '@shared/core/Service';

interface Request {
  data: TemplateAttributes;
}

class SaveTemplateService implements Service<Request, TemplateDocument> {
  execute({ data }: Request): Promise<TemplateDocument> {
    return Template.create(data);
  }
}

export default SaveTemplateService;
