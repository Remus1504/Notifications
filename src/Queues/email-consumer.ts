import { config } from '@notifications/config';
import { IEmailLocals, winstonLogger } from '@remus1504/micrograde';
import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from './connect';
import { sendEmail } from './mail.sender';

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_ENDPOINT}`,
  'emailConsumer',
  'debug',
);

async function consumeAuthEmailMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'micrograde-email-notification';
    const routingKey = 'auth-email';
    const queueName = 'auth-email-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const microgradeQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });
    await channel.bindQueue(microgradeQueue.queue, exchangeName, routingKey);
    channel.consume(
      microgradeQueue.queue,
      async (msg: ConsumeMessage | null) => {
        const { receiverEmail, username, verifyLink, resetLink, template } =
          JSON.parse(msg!.content.toString());
        const locals: IEmailLocals = {
          appLink: `${config.CLIENT_URL}`,
          appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
          username,
          verifyLink,
          resetLink,
        };
        await sendEmail(template, receiverEmail, locals);
        channel.ack(msg!);
      },
    );
  } catch (error) {
    log.log(
      'error',
      'NotificationService EmailConsumer consumeAuthEmailMessages() method error:',
      error,
    );
  }
}

async function consumeOrderEmailMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'micrograde-enrolment-notification';
    const routingKey = 'enrolment-email';
    const queueName = 'enrolment-email-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const microgradeQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });
    await channel.bindQueue(microgradeQueue.queue, exchangeName, routingKey);
    channel.consume(
      microgradeQueue.queue,
      async (msg: ConsumeMessage | null) => {
        const {
          receiverEmail,
          username,
          template,
          sender,
          offerLink,
          amount,
          studentUsername,
          instructorUsername,
          title,
          description,
          durationDays,
          orderId,
          orderDue,
          requirements,
          orderUrl,
          originalDate,
          newDate,
          reason,
          subject,
          header,
          type,
          message,
          serviceFee,
          total,
        } = JSON.parse(msg!.content.toString());
        const locals: IEmailLocals = {
          appLink: `${config.CLIENT_URL}`,
          appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
          username,
          sender,
          offerLink,
          amount,
          studentUsername,
          instructorUsername,
          title,
          description,
          durationDays,
          orderId,
          orderDue,
          requirements,
          orderUrl,
          originalDate,
          newDate,
          reason,
          subject,
          header,
          type,
          message,
          serviceFee,
          total,
        };
        if (template === 'orderPlaced') {
          await sendEmail('orderPlaced', receiverEmail, locals);
          await sendEmail('orderReceipt', receiverEmail, locals);
        } else {
          await sendEmail(template, receiverEmail, locals);
        }
        channel.ack(msg!);
      },
    );
  } catch (error) {
    log.log(
      'error',
      'NotificationService EmailConsumer consumeOrderEmailMessages() method error:',
      error,
    );
  }
}

export { consumeAuthEmailMessages, consumeOrderEmailMessages };
