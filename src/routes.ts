import { Router } from 'express';
import fs from 'fs';
import path from 'path';

import CreateMessageService from '@services/CreateMessageService';
import ImportContactsService from '@services/ImportContactsService';

const routes = Router();

routes.post('/contacts/import', async (req, res) => {
  const { tags } = req.body;

  const contactsReadStream = fs.createReadStream(
    path.resolve(__dirname, '..', 'tmp', 'contacts.csv'),
  );

  const importContacts = new ImportContactsService();

  await importContacts.run(contactsReadStream, tags);

  return res.send();
});

routes.post('/messages', async (req, res) => {
  const { subject, body, tags } = req.body;
  const createMessage = new CreateMessageService();

  const messageData = { subject, body };

  const message = await createMessage.run(messageData, tags);

  return res.json(message);
});

export default routes;
