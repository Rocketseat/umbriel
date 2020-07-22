import Message from '@modules/messages/infra/mongoose/schemas/Message';

import Service from '@shared/core/Service';

class DeleteMessageService implements Service<string, void> {
  async execute(id: string): Promise<void> {
    const message = await Message.findById(id);

    if (!message) {
      throw new Error('Message not found');
    }

    if (message.sentAt) {
      throw new Error('Message already sent');
    }

    await message.remove();
  }
}

export default DeleteMessageService;
