import SESProvider from './implementations/mail/SESProvider';
import MailtrapProvider from './implementations/mail/MailtrapProvider';
import FakeProvider from './implementations/mail/FakeProvider';

import WinstonProvider from './implementations/logger/WinstonProvider';

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
