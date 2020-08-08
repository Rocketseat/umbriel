import express from 'express';

import { container } from 'tsyringe';
import * as Yup from 'yup';

import CreateSenderService from '@modules/senders/services/CreateSenderService';
import DeleteSenderService from '@modules/senders/services/DeleteSenderService';
import GetSenderService from '@modules/senders/services/GetSenderService';
import SearchSendersService from '@modules/senders/services/SearchSendersService';
import UpdateSenderService from '@modules/senders/services/UpdateSenderService';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

const senderRouter = express.Router();

senderRouter.use(ensureAuthenticated);

const schema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
});

senderRouter.get('/', async (req, res) => {
  const { page, per_page = 20, search = '' } = req.query;

  const perPage = Number(per_page);
  const searchSenders = container.resolve(SearchSendersService);

  const { senders, totalCount } = await searchSenders.execute({
    page: Number(page),
    per_page: perPage,
    search: String(search),
  });

  res.header('X-Total-Count', String(totalCount));
  res.header('X-Total-Page', String(Math.ceil(totalCount / perPage)));

  return res.json(senders);
});

senderRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const getSender = container.resolve(GetSenderService);

  const sender = await getSender.execute(id);

  return res.json(sender);
});

senderRouter.post('/', async (req, res) => {
  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validations fails' });
  }

  const { name, email } = req.body;

  const createSender = container.resolve(CreateSenderService);

  const senderData = { name, email };

  const sender = await createSender.execute({ data: senderData });

  return res.json(sender);
});

senderRouter.put('/:id', async (req, res) => {
  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validations fails' });
  }

  const { id } = req.params;
  const { name, email } = req.body;

  const updateSender = container.resolve(UpdateSenderService);

  const sender = await updateSender.execute({
    id,
    data: {
      name,
      email,
    },
  });

  return res.json(sender);
});

senderRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const deleteSender = container.resolve(DeleteSenderService);

  await deleteSender.execute(id);

  return res.send();
});

export default senderRouter;
