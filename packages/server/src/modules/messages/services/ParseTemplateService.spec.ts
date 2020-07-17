import beautify from 'js-beautify';

import Template from '@modules/messages/infra/mongoose/schemas/Template';
import ParseTemplateService from '@modules/messages/services/ParseTemplateService';

import MongoMock from '@shared/tests/MongoMock';

describe('Create Message', () => {
  beforeAll(async () => {
    await MongoMock.connect();
  });

  afterAll(async () => {
    await MongoMock.disconnect();
  });

  beforeEach(async () => {
    await Template.deleteMany({});
  });

  it('should be able to create new template', async () => {
    const parseTemplate = new ParseTemplateService();

    const templateData = {
      title: 'Rocketseat',
      content: `
        {{ message_content }}
        <br>
        <p>
          Abraaaaço!<br>
          <strong>Diego Fernandes</strong><br>
          CTO | Rocketseat
        </p>
      `,
    };

    const template = await Template.create(templateData);

    const finalTemplate = parseTemplate.execute({
      template,
      messageContent: `
        Faaaala dev, beleza?

        Testando se o parse da template funciona mesmo :)
      `,
    });

    expect(finalTemplate).toEqual(
      beautify.html(
        `
      <p style="margin-bottom: 1em">Faaaala dev, beleza?</p>
      <p style="margin-bottom: 1em">Testando se o parse da template funciona mesmo :)</p>
      <br>
      <p>
        Abraaaaço!<br>
        <strong>Diego Fernandes</strong><br>
        CTO | Rocketseat
      </p>
    `.trim(),
        {
          indent_size: 2,
        },
      ),
    );
  });
});
