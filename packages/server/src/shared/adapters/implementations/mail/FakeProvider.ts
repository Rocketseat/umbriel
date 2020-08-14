import MailProvider from '../../models/MailProvider';

interface Message {
  from: {
    name: string;
    email: string;
  };
  to: string;
  subject: string;
  body: string;
}

class FakeProvider implements MailProvider {
  async sendEmail(data: Message): Promise<void> {
    console.log(data);
  }
}

export default FakeProvider;
