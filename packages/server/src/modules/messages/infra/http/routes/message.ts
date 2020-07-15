import express from 'express';
import { container } from 'tsyringe';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import Message from '@modules/messages/infra/mongoose/schemas/Message';
import Template from '@modules/messages/infra/mongoose/schemas/Template';
import Contact from '@modules/contacts/infra/mongoose/schemas/Contact';
import Sender from '@modules/senders/infra/mongoose/schemas/Sender';

import CreateMessageService from '@modules/messages/services/CreateMessageService';
import ParseTemplateService from '@modules/messages/services/ParseTemplateService';
import SendMessageService from '@modules/messages/services/SendMessageService';
import SearchMessagesService from '@modules/messages/services/SearchMessagesService';
import GetMessageService from '@modules/messages/services/GetMessageService';
import DeleteMessageService from '@modules/messages/services/DeleteMessageService';

const messageRouter = express.Router();

messageRouter.use(ensureAuthenticated);

messageRouter.get('/', async (req, res) => {
  const { page = 1, per_page = 10, search = '' } = req.query;

  const searchMessages = container.resolve(SearchMessagesService);

  const { messages, totalCount } = await searchMessages.execute({
    page,
    per_page,
    search,
  });

  res.header('X-Total-Count', String(totalCount));
  res.header('X-Total-Page', String(Math.ceil(totalCount / per_page)));

  return res.json(messages);
});

messageRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const getMessage = container.resolve(GetMessageService);

  const message = await getMessage.execute(id);

  return res.json(message);
});

// @TODO: Parse template inside CreateMessageService
messageRouter.post('/', async (req, res) => {
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
