import csvParse from 'csv-parse';
import { Readable } from 'stream';
import { container } from 'tsyringe';

import Service from '@shared/core/Service';

import CreateContactService from './CreateContactService';

interface Request {
  contactsFileStream: Readable;
  tags: string[];
}

class ImportContactsService implements Service<Request, void> {
  async execute({ contactsFileStream, tags }: Request): Promise<void> {
    const parsers = csvParse({
      delimiter: ';',
    });

    const parseCSV = contactsFileStream.pipe(parsers);
    const createContact = container.resolve(CreateContactService);

    const teams = tags.map(tag => ({ title: tag }));

    parseCSV.on('data', async line => {
      const [email] = line;

      if (!email) return;

      await createContact.execute({
        email,
        teams,
      });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));
  }
}

export default ImportContactsService;
