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
    if (!data.content.includes('{{ message_content }}')) {
      throw new Error(
        '{{ message_content }} variable is required inside template.',
      );
    }

    return Template.create(data);
  }
}

export default SaveTemplateService;
