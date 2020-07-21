import beautify from 'js-beautify';

import { TemplateDocument } from '@modules/messages/infra/mongoose/schemas/Template';

import Service from '@shared/core/Service';

interface Request {
  template: TemplateDocument;
  messageContent: string;
}

class ParseTemplateService implements Service<Request, string> {
  execute({ template, messageContent }: Request): string {
    const content = `<p style="margin-bottom: 1em">${messageContent
      .trim()
      .replace(/\n\n/g, '\n')
      .split('\n')
      .map(line => line.trim())
      .join('</p><p style="margin-bottom: 1em">')}</p>`;

    const unsubscribeLink = `${process.env.APP_URL}/contacts/unsubscribe?contact={{ contact_id }}`;

    const unsubscribeBlock = [
      '<br>',
      '<p style="font-size: 12px; color: #666;">',
      'não quer mais receber esses e-mails? 😢 ',
      `<a href="${unsubscribeLink}">remover inscrição</a>`,
      '</p>',
    ].join('');

    const finalTemplate = template.content
      .replace('{{ message_content }}', content.trim())
      .replace('{{ unsubscribe_link }}', unsubscribeBlock)
      .trim();

    return beautify.html(finalTemplate, {
      indent_size: 2,
    });
  }
}

export default ParseTemplateService;
