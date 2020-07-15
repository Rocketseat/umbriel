import express from 'express';
import { container } from 'tsyringe';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import SearchTagsService from '@modules/contacts/services/SearchTagsService';
import GetRecipientsFromTags from '@modules/contacts/services/GetRecipientsFromTags';

const tagRouter = express.Router();

tagRouter.use(ensureAuthenticated);

tagRouter.get('/', async (req, res) => {
  const { search } = req.query;

  const searchTags = container.resolve(SearchTagsService);

  const tags = await searchTags.execute({ search });

  return res.json(tags);
});

tagRouter.get('/recipients', async (req, res) => {
  const { tags } = req.query;

  const tagsArray = tags.split(',').map((tag: string) => tag.trim());

  const getRecipientsFromTags = new GetRecipientsFromTags();

  const recipients = await getRecipientsFromTags.execute({ tags: tagsArray });

  return res.json({ recipients: recipients.length });
});

export default tagRouter;
