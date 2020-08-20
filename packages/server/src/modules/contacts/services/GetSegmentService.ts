import Segment, {
  SegmentDocument,
} from '@modules/contacts/infra/mongoose/schemas/Segment';

import Service from '@shared/core/Service';

type Request = string;

type Response = SegmentDocument;

class GetSegmentService implements Service<Request, Response> {
  async execute(id: Request): Promise<Response> {
    const segment = await Segment.findById(id).populate('tags');

    if (!segment) {
      throw new Error('Segment not found.');
    }

    return segment;
  }
}

export default GetSegmentService;
