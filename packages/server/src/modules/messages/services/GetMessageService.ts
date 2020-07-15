import Message, {
  MessageDocument,
} from '@modules/messages/infra/mongoose/schemas/Message';

import Service from '@shared/core/Service';

type Request = string;

type Response = MessageDocument;

class GetMessageService implements Service<Request, Response> {
  async execute(id: Request): Promise<Response> {
    const message = await Message.findById(id);

    if (!message) {
      throw new Error('Message not found.');
    }

    return message;
  }
}

export default GetMessageService;
