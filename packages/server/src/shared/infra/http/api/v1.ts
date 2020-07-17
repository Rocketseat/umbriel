import { Router } from 'express';

import contactRouter from '@modules/contacts/infra/http/routes/contact';
import tagRouter from '@modules/contacts/infra/http/routes/tag';
import messageRouter from '@modules/messages/infra/http/routes/message';
import templateRouter from '@modules/messages/infra/http/routes/template';
import senderRouter from '@modules/senders/infra/http/routes/sender';
import sessionRouter from '@modules/users/infra/http/routes/session';

const v1Router = Router();

v1Router.use('/contacts', contactRouter);
v1Router.use('/tags', tagRouter);
v1Router.use('/messages', messageRouter);
v1Router.use('/templates', templateRouter);
v1Router.use('/sessions', sessionRouter);
v1Router.use('/senders', senderRouter);

export default v1Router;
