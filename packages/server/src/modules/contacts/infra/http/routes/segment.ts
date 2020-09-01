import express from 'express';

import { container } from 'tsyringe';
import * as Yup from 'yup';

import CreateSegmentService from '@modules/contacts/services/CreateSegmentService';
import DeleteSegmentService from '@modules/contacts/services/DeleteSegmentService';
import GetSegmentService from '@modules/contacts/services/GetSegmentService';
import SearchSegmentsService from '@modules/contacts/services/SearchSegmentsService';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

const segmentRouter = express.Router();

segmentRouter.use(ensureAuthenticated);

segmentRouter.get('/', async (req, res) => {
  const { page, per_page = 20, search = '' } = req.query;

  const perPage = Number(per_page);
  const searchSegments = container.resolve(SearchSegmentsService);

  const { segments, totalCount } = await searchSegments.execute({
    page: Number(page),
    per_page: perPage,
    search: String(search),
  });

  res.header('X-Total-Count', String(totalCount));
  res.header('X-Total-Page', String(Math.ceil(totalCount / perPage)));

  return res.json(segments);
});

segmentRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const getSegment = container.resolve(GetSegmentService);
  const segment = await getSegment.execute(id);

  return res.json(segment);
});

segmentRouter.post('/', async (req, res) => {
  const schema = Yup.object().shape({
    title: Yup.string().required(),
    tags: Yup.array().of(Yup.string().required()).required(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validation fails' });
  }

  const { title, tags, id } = req.body;

  const createSegment = container.resolve(CreateSegmentService);

  await createSegment.execute({
    title,
    tags,
    id,
  });

  return res.send();
});

segmentRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const deleteSegment = container.resolve(DeleteSegmentService);

  await deleteSegment.execute(id);

  return res.send();
});

export default segmentRouter;
