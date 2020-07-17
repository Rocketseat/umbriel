import Message from '@modules/messages/infra/mongoose/schemas/Message';
import Sender from '@modules/senders/infra/mongoose/schemas/Sender';

import Service from '@shared/core/Service';

type Request = string;
type Response = void;

class DeleteSenderService implements Service<Request, Response> {
  async execute(id: Request): Promise<Response> {
    const sender = await Sender.findById(id);

    if (!sender) {
      throw new Error('Sender not found');
    }

    const hasMessages = await Message.findOne({
      sender: {
        email: {
          $eq: sender.email,
        },
      },
    });

    if (hasMessages) {
      throw new Error(
        "You can't delete a sender that has already sent messages",
      );
    }

    await sender.remove();
  }
}

export default DeleteSenderService;
