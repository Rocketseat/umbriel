import Segment from '@modules/contacts/infra/mongoose/schemas/Segment';

import Service from '@shared/core/Service';

class DeleteSegmentService implements Service<string, void> {
  async execute(id: string): Promise<void> {
    const segment = await Segment.findById(id);

    if (!segment) {
      throw new Error('Segment not found');
    }

    await segment.remove();
  }
}

export default DeleteSegmentService;
