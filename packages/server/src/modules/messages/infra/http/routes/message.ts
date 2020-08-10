import express from 'express';

import { container } from 'tsyringe';
import * as Yup from 'yup';

import Contact from '@modules/contacts/infra/mongoose/schemas/Contact';
import Template from '@modules/messages/infra/mongoose/schemas/Template';
import CreateMessageService from '@modules/messages/services/CreateMessageService';
import DeleteMessageService from '@modules/messages/services/DeleteMessageService';
import GetMessageService from '@modules/messages/services/GetMessageService';
import ParseTemplateService from '@modules/messages/services/ParseTemplateService';
import SearchMessagesService from '@modules/messages/services/SearchMessagesService';
import SendMessageService from '@modules/messages/services/SendMessageService';
import Sender from '@modules/senders/infra/mongoose/schemas/Sender';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

const messageRouter = express.Router();

messageRouter.use(ensureAuthenticated);

messageRouter.get('/', async (req, res) => {
  const { page = 1, per_page = 10, search = '' } = req.query;

  const searchMessages = container.resolve(SearchMessagesService);

  const perPage = Number(per_page);
  const { messages, totalCount } = await searchMessages.execute({
    page: Number(page),
    per_page: perPage,
    search: String(search),
  });

  res.header('X-Total-Count', String(totalCount));
  res.header('X-Total-Page', String(Math.ceil(totalCount / perPage)));

  return res.json(messages);
});

messageRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const getMessage = container.resolve(GetMessageService);

  const message = await getMessage.execute(id);

  return res.json(message);
});

messageRouter.post('/', async (req, res) => {
  const schema = Yup.object().shape({
    subject: Yup.string().required(),
    body: Yup.string().required(),
    template: Yup.string(),
    sender: Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
    }),
    tags: Yup.array().of(Yup.string()).required(),
  });

  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validation fails' });
  }

  const { subject, body, template, sender, tags } = req.body;
  let finalBody = body;

  const createMessage = container.resolve(CreateMessageService);
  const parseTemplate = container.resolve(ParseTemplateService);

  const senderDoc = await Sender.findById(sender);

  if (!senderDoc) {
    throw new Error('Sender not found');
  }

  if (template) {
    const templateDoc = await Template.findById(template);

    if (templateDoc) {
      finalBody = parseTemplate.execute({
        template: templateDoc,
        messageContent: body,
      });
    }
  }

  const recipients = await Contact.findByTags(tags);
  const recipientsCount = recipients.length;

  const messageData = {
    subject,
    body,
    finalBody,
    recipientsCount,
    template,
    sender: {
      name: senderDoc.name,
      email: senderDoc.email,
    },
    tags,
  };

  const message = await createMessage.execute({ data: messageData });

  return res.json(message);
});

messageRouter.post('/:id/send', async (req, res) => {
  const { id } = req.params;

  const sendMessage = container.resolve(SendMessageService);
  const message = await sendMessage.execute(id);

  return res.json(message);
});

messageRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const deleteMessage = container.resolve(DeleteMessageService);

  await deleteMessage.execute(id);

  return res.send();
});

export default messageRouter;
