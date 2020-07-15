import Sender, {
  SenderAttributes,
  SenderDocument,
} from '@modules/senders/infra/mongoose/schemas/Sender';

import Service from '@shared/core/Service';

interface Request {
  data: SenderAttributes;
}

class CreateSenderService implements Service<Request, SenderDocument> {
  async execute({ data }: Request): Promise<SenderDocument> {
    const duplicatedSender = await Sender.findOne({ email: data.email });

    if (duplicatedSender) {
      throw new Error('Duplicated sender');
    }

    const sender = await Sender.create(data);

    return sender;
  }
}

export default CreateSenderService;
