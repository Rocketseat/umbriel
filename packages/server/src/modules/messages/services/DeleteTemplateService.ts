import Service from '@shared/core/Service';

import Template from '@modules/messages/infra/mongoose/schemas/Template';

class DeleteTemplateService implements Service<string, void> {
  async execute(id: string): Promise<void> {
    const template = await Template.findById(id);

    if (!template) {
      throw new Error('Template not found');
    }

    await template.remove();
  }
}

export default DeleteTemplateService;
