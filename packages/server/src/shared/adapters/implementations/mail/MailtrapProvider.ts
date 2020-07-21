import nodemailer, { Transporter } from 'nodemailer';

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

class MailtrapProvider implements MailProvider {
  private transporter: Transporter;

  constructor(mailConfig: object) {
    this.transporter = nodemailer.createTransport(mailConfig);
  }

  async sendEmail(message: Message): Promise<void> {
    await this.transporter.sendMail({
      from: {
        name: message.from.name,
        address: message.from.email,
      },
      to: message.to,
      subject: message.subject,
      html: message.body,
    });
  }
}

export default MailtrapProvider;
