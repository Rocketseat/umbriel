import SES from 'aws-sdk/clients/ses';
import MessageData from './structures/MessageData';

class SendMessageToRecipientService {
  private client: SES;

  constructor() {
    this.client = new SES({
      region: 'us-east-1',
    });
  }

  async run(to: string, messageData: MessageData): Promise<void> {
    await this.client
      .sendEmail({
        Source: 'Diego Fernandes <diego@rocketseat.com.br>',
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: messageData.subject,
          },
          Body: {
            Text: {
              Data: messageData.body,
            },
          },
        },
        ConfigurationSetName: 'Umbriel',
      })
      .promise();
  }
}

export default SendMessageToRecipientService;
