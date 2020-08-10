import express from 'express';

import { container } from 'tsyringe';
import * as Yup from 'yup';

import CreateTemplateService from '@modules/messages/services/CreateTemplateService';
import DeleteTemplateService from '@modules/messages/services/DeleteTemplateService';
import GetTemplateService from '@modules/messages/services/GetTemplateService';
import SearchTemplatesService from '@modules/messages/services/SearchTemplatesService';
import UpdateTemplateService from '@modules/messages/services/UpdateTemplateService';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

const templateRouter = express.Router();

templateRouter.use(ensureAuthenticated);

const schema = Yup.object().shape({
  title: Yup.string().required(),
  content: Yup.string().test(
    'find',
    '{{ message_content }} variable is required inside template.',
    (val: string) => val.includes('{{ message_content }}'),
  ),
});

templateRouter.get('/', async (req, res) => {
  const { page, per_page = 20, search = '' } = req.query;

  const perPage = Number(per_page);
  const searchTemplates = container.resolve(SearchTemplatesService);

  const { templates, totalCount } = await searchTemplates.execute({
    page: Number(page),
    per_page: perPage,
    search: String(search),
  });

  res.header('X-Total-Count', String(totalCount));
  res.header('X-Total-Page', String(Math.ceil(totalCount / perPage)));

  return res.json(templates);
});

templateRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const getTemplate = container.resolve(GetTemplateService);
  const template = await getTemplate.execute(id);

  return res.json(template);
});

templateRouter.post('/', async (req, res) => {
  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validation fails' });
  }

  const { title, content } = req.body;

  const createTemplate = container.resolve(CreateTemplateService);

  const templateData = { title, content };

  const template = await createTemplate.execute({ data: templateData });

  return res.json(template);
});

templateRouter.put('/:id', async (req, res) => {
  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validation fails' });
  }

  const { id } = req.params;
  const { title, content } = req.body;

  const updateTemplate = container.resolve(UpdateTemplateService);

  const template = await updateTemplate.execute({
    id,
    data: {
      title,
      content,
    },
  });

  return res.json(template);
});

templateRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const deleteTemplate = container.resolve(DeleteTemplateService);

  await deleteTemplate.execute(id);

  return res.send();
});

export default templateRouter;
