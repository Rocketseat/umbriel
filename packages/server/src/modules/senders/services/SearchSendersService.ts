import Sender, {
  SenderDocument,
} from '@modules/senders/infra/mongoose/schemas/Sender';

import Service from '@shared/core/Service';

interface Request {
  search: string;
  page: number;
  per_page?: number;
}

type Response = {
  senders: SenderDocument[];
  totalCount: number;
};

class SearchSendersService implements Service<Request, Response> {
  async execute({ search, page, per_page = 20 }: Request): Promise<Response> {
    const senders = await Sender.find({
      name: new RegExp(`${search.toLowerCase()}`, 'i'),
    })
      .limit(per_page)
      .skip(per_page * (page - 1));

    const totalCount = await Sender.estimatedDocumentCount();

    return { senders, totalCount };
  }
}

export default SearchSendersService;
