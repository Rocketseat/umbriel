import Sender, {
  SenderDocument,
} from '@modules/senders/infra/mongoose/schemas/Sender';

import Service from '@shared/core/Service';

type Request = string;

type Response = SenderDocument;

class GetSenderService implements Service<Request, Response> {
  async execute(id: Request): Promise<Response> {
    const sender = await Sender.findById(id);

    if (!sender) {
      throw new Error('Sender not found.');
    }

    return sender;
  }
}

export default GetSenderService;
