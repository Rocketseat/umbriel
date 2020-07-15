import SES from 'aws-sdk/clients/ses';
import htmlToText from 'html-to-text';

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

class SESProvider implements MailProvider {
  private client: SES;

  constructor() {
    this.client = new SES({
      region: 'us-east-1',
    });
  }

  async sendEmail(message: Message): Promise<void> {
    await this.client
      .sendEmail({
        Source: `${message.from.name} <${message.from.email}>`,
        Destination: {
          ToAddresses: [message.to],
        },
        Message: {
          Subject: {
            Data: message.subject,
          },
          Body: {
            Html: {
              Data: message.body,
            },
            Text: {
              Data: htmlToText.fromString(message.body, {
                ignoreImage: true,
                preserveNewlines: true,
                wordwrap: 120,
              }),
            },
          },
        },
        Tags: [
          {
            Name: 'identificator',
            Value: message.to.replace('@', '').replace(/\./g, ''),
          },
        ],
        ConfigurationSetName: 'Umbriel',
      })
      .promise();
  }
}

export default SESProvider;
