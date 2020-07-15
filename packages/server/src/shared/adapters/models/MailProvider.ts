interface Message {
  from: {
    name: string;
    email: string;
  };
  to: string;
  subject: string;
  body: string;
}

export default interface MailProvider {
  sendEmail(message: Message): Promise<void>;
}
