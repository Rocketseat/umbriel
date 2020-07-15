import Message, {
  MessageDocument,
  MessageAttributes,
} from '@modules/messages/infra/mongoose/schemas/Message';

import Service from '@shared/core/Service';

interface Request {
  data: MessageAttributes;
}

class CreateMessageService implements Service<Request, MessageDocument> {
  execute({ data }: Request): Promise<MessageDocument> {
    return Message.create(data);
  }
}

export default CreateMessageService;
