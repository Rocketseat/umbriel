import express from 'express';

import { container } from 'tsyringe';

import GetRecipientsFromTags from '@modules/contacts/services/GetRecipientsFromTags';
import SearchTagsService from '@modules/contacts/services/SearchTagsService';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

const tagRouter = express.Router();

tagRouter.use(ensureAuthenticated);

tagRouter.get('/', async (req, res) => {
  const { search } = req.query;

  const searchTags = container.resolve(SearchTagsService);

  const tags = await searchTags.execute({ search: String(search) });

  return res.json(tags);
});

tagRouter.get('/recipients', async (req, res) => {
  const { tags } = req.query;

  const tagsArray = String(tags)
    .split(',')
    .map((tag: string) => tag.trim());

  const getRecipientsFromTags = new GetRecipientsFromTags();

  const recipients = await getRecipientsFromTags.execute({ tags: tagsArray });

  return res.json({ recipients: recipients.length });
});

export default tagRouter;
