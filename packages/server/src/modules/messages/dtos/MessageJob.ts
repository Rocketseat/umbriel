import { ContactDocument } from '@modules/contacts/infra/mongoose/schemas/Contact';
import { MessageDocument } from '@modules/messages/infra/mongoose/schemas/Message';

export default interface MessageJob {
  contact: ContactDocument;
  message: MessageDocument;
}
