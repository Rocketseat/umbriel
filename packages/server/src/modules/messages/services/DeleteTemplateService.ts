import Template from '@modules/messages/infra/mongoose/schemas/Template';

import Service from '@shared/core/Service';

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
