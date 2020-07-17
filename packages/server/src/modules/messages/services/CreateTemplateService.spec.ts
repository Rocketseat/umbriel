import Template from '@modules/messages/infra/mongoose/schemas/Template';
import CreateTemplateService from '@modules/messages/services/CreateTemplateService';

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
    const createTemplate = new CreateTemplateService();

    const templateData = {
      title: 'Rocketseat',
      content: `
        <style>
        .message-content { max-width: 600px; font-size: 16px; line-height: 1.6; }
        .message-content div { padding-bottom: 10px; }
        .message-content img { max-width: 100%; height: auto; }
          p {
            margin-bottom: 1em;
          }
        </style>
        <div class='message-content'>
          {{ message_content }}
          <br>
          <p>
            Abraaaaço!<br>
            <strong>Diego Fernandes</strong><br>
            CTO | Rocketseat
          </p>
        </div>
      `,
    };

    await createTemplate.execute({ data: templateData });

    const template = await Template.findOne(templateData);

    expect(template).toBeTruthy();
  });

  it('should not be able to create template without {{message_content}}', async () => {
    expect.assertions(1);

    try {
      const createTemplate = new CreateTemplateService();

      const templateData = {
        title: 'Rocketseat',
        content: `Template without content`,
      };

      await createTemplate.execute({ data: templateData });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });
});
