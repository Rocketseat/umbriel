import Segment, {
  SegmentDocument,
} from '@modules/contacts/infra/mongoose/schemas/Segment';

import Service from '@shared/core/Service';

interface Request {
  search: string;
  page: number;
  per_page?: number;
}

type Response = {
  segments: SegmentDocument[];
  totalCount: number;
};

class SearchSegmentsService implements Service<Request, Response> {
  async execute({ search, page, per_page = 20 }: Request): Promise<Response> {
    const segments = await Segment.find({
      title: new RegExp(`${search.toLowerCase()}`, 'i'),
    })
      .limit(per_page)
      .skip(per_page * (page - 1));

    const totalCount = await Segment.estimatedDocumentCount();

    return { segments, totalCount };
  }
}

export default SearchSegmentsService;
