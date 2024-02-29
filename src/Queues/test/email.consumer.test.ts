import * as connection from '../../Queues/connect';
import amqp from 'amqplib';
import {
  consumeAuthEmailMessages,
  consumeOrderEmailMessages,
} from '../../Queues/email-consumer';

jest.mock('../../Queues/connect');
jest.mock('amqplib');
jest.mock('@remus1504/micrograde');

describe('Email Consumer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('consumeAuthEmailMessages method', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
      };
      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({
        queue: 'auth-email-queue',
        messageCount: 0,
        consumerCount: 0,
      });
      jest
        .spyOn(connection, 'createConnection')
        .mockReturnValue(channel as never);
      const connectionChannel: amqp.Channel | undefined =
        await connection.createConnection();
      await consumeAuthEmailMessages(connectionChannel!);
      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith(
        'micrograde-email-notification',
        'direct',
      );
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith(
        'auth-email-queue',
        'micrograde-email-notification',
        'auth-email',
      );
    });
  });

  describe('consumeOrderEmailMessages method', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
      };
      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({
        queue: 'enrolment-email-queue',
        messageCount: 0,
        consumerCount: 0,
      });
      jest
        .spyOn(connection, 'createConnection')
        .mockReturnValue(channel as never);
      const connectionChannel: amqp.Channel | undefined =
        await connection.createConnection();
      await consumeOrderEmailMessages(connectionChannel!);
      expect(connectionChannel!.assertExchange).toHaveBeenCalledWith(
        'micrograde-enrolment-notification',
        'direct',
      );
      expect(connectionChannel!.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.consume).toHaveBeenCalledTimes(1);
      expect(connectionChannel!.bindQueue).toHaveBeenCalledWith(
        'enrolment-email-queue',
        'micrograde-enrolment-notification',
        'enrolment-email',
      );
    });
  });
});
