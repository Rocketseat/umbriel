import Sender, {
  SenderAttributes,
  SenderDocument,
} from '@modules/senders/infra/mongoose/schemas/Sender';

import Service from '@shared/core/Service';

interface Request {
  id: string;
  data: SenderAttributes;
}

type Response = SenderDocument;

class UpdateSenderService implements Service<Request, Response> {
  async execute({ id, data }: Request): Promise<Response> {
    const duplicatedSender = await Sender.findOne({
      email: data.email,
      _id: { $ne: id },
    });

    if (duplicatedSender) {
      throw new Error('Duplicated sender');
    }

    const sender = await Sender.findByIdAndUpdate(id, data, { new: true });

    if (!sender) {
      throw new Error('Sender not found');
    }

    return sender;
  }
}

export default UpdateSenderService;
