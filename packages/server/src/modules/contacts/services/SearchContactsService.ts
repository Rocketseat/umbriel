import Contact, {
  ContactDocument,
} from '@modules/contacts/infra/mongoose/schemas/Contact';

import Service from '@shared/core/Service';

interface Request {
  search: string;
  page: number;
  per_page?: number;
}

interface Response {
  contacts: ContactDocument[];
  totalCount: number;
}

class SearchContactsService implements Service<Request, Response> {
  async execute({ search, page, per_page = 20 }: Request): Promise<Response> {
    const contacts = await Contact.find()
      .where({
        email: {
          $regex: search,
          $options: 'i',
        },
      })
      .populate('tags')
      .limit(per_page)
      .skip(per_page * (page - 1));

    const totalCount = await Contact.estimatedDocumentCount();

    return { contacts, totalCount };
  }
}

export default SearchContactsService;
