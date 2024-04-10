import { config } from '@notifications/config';
import { emailTemplates } from '../emailHelpers';
import { IEmailLocals, winstonLogger } from '@remus1504/micrograde-shared';
import { Logger } from 'winston';

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_ENDPOINT}`,
  'mailTransport',
  'debug',
);

async function sendEmail(
  template: string,
  receiverEmail: string,
  locals: IEmailLocals,
): Promise<void> {
  try {
    emailTemplates(template, receiverEmail, locals);
    log.info('Email sent successfully.');
  } catch (error) {
    log.log(
      'error',
      'NotificationService MailTransport sendEmail() method error:',
      error,
    );
  }
}

export { sendEmail };
