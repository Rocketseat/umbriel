import WinstonProvider from './implementations/logger/WinstonProvider';
import FakeProvider from './implementations/mail/FakeProvider';
import MailtrapProvider from './implementations/mail/MailtrapProvider';
import SESProvider from './implementations/mail/SESProvider';
import BullProvider from './implementations/queue/BullProvider';

const providers = {
  mail: {
    ses: SESProvider,
    mailtrap: MailtrapProvider,
    fake: FakeProvider,
  },
  logger: {
    winston: WinstonProvider,
  },
  queue: {
    bull: BullProvider,
  },
};

export default providers;
