import Message, {
  MessageDocument,
} from '@modules/messages/infra/mongoose/schemas/Message';

import Service from '@shared/core/Service';

interface Request {
  search: string;
  page: number;
  per_page?: number;
}

type Response = {
  messages: MessageDocument[];
  totalCount: number;
};

class SearchMessagesService implements Service<Request, Response> {
  async execute({ search, page, per_page = 20 }: Request): Promise<Response> {
    const messages = await Message.find({
      subject: new RegExp(`${search.toLowerCase()}`, 'i'),
    })
      .sort({ createdAt: -1 })
      .populate('tags')
      .limit(per_page)
      .skip(per_page * (page - 1));

    const totalCount = await Message.estimatedDocumentCount();

    return { messages, totalCount };
  }
}

export default SearchMessagesService;
