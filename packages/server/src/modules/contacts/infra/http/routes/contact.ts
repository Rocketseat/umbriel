import express from 'express';

import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { container } from 'tsyringe';
import * as Yup from 'yup';

import ChangeContactSubscriptionStatusService from '@modules/contacts/services/ChangeContactSubscriptionStatusService';
import DeleteContactService from '@modules/contacts/services/DeleteContactService';
import ImportContactsService from '@modules/contacts/services/ImportContactsService';
import SearchContactsService from '@modules/contacts/services/SearchContactsService';

import uploadConfig from '@config/upload';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

const contactRouter = express.Router();
const upload = multer(uploadConfig.config.multer);

contactRouter.get('/unsubscribe', async (req, res) => {
  const { contact } = req.query;

  if (!contact) {
    return res.status(404).send();
  }

  const changeContactSubscriptionStatus = container.resolve(
    ChangeContactSubscriptionStatusService,
  );

  await changeContactSubscriptionStatus.execute({
    contact_id: String(contact),
    subscribed: false,
  });

  return res.sendFile(
    path.resolve(__dirname, '..', '..', '..', 'views', 'unsubscribed.html'),
  );
});

contactRouter.use(ensureAuthenticated);

contactRouter.get('/', async (req, res) => {
  const { page, per_page = 20, search = '' } = req.query;

  const searchContacts = container.resolve(SearchContactsService);

  const perPage = Number(per_page);
  const { contacts, totalCount } = await searchContacts.execute({
    page: Number(page),
    per_page: perPage,
    search: String(search),
  });

  res.header('X-Total-Count', String(totalCount));
  res.header('X-Total-Page', String(Math.ceil(totalCount / perPage)));

  return res.json(contacts);
});

contactRouter.post('/import', upload.single('file'), async (req, res) => {
  const schema = Yup.object().shape({
    tags: Yup.string().required(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validation fails' });
  }

  const { tags } = req.body;

  const filePath = path.resolve(uploadConfig.tmpDir, req.file.filename);
  const contactsReadStream = fs.createReadStream(filePath);

  const importContacts = container.resolve(ImportContactsService);

  const tagsAsArray = tags.split(',').map((tag: string) => tag.trim());

  await importContacts.execute({
    contactsFileStream: contactsReadStream,
    tags: tagsAsArray,
  });

  await fs.promises.unlink(filePath);

  return res.send();
});

contactRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const deleteContact = container.resolve(DeleteContactService);

  await deleteContact.execute(id);

  return res.send();
});

contactRouter.patch('/:contact_id/subscription', async (req, res) => {
  const schema = Yup.object().shape({
    subscribed: Yup.boolean().required(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validation fails' });
  }

  const { contact_id } = req.params;
  const { subscribed } = req.body;

  const changeContactSubscriptionStatus = container.resolve(
    ChangeContactSubscriptionStatusService,
  );

  const contact = await changeContactSubscriptionStatus.execute({
    contact_id,
    subscribed,
  });

  return res.json(contact);
});

export default contactRouter;
