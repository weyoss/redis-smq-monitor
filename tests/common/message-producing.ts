import { IConfig, TQueueParams } from 'redis-smq/dist/types';
import { config } from './config';
import { promisifyAll } from 'bluebird';
import { events, Message } from 'redis-smq';
import {
  untilConsumerEvent,
  untilMessageAcknowledged,
} from './consumer-events';
import { getProducer } from './producers';
import { getConsumer } from './consumers';
import { getQueueManagerAsync } from './queue-manager';
import { defaultQueue } from './common';

export async function createQueue(
  queue: string | TQueueParams,
  priorityQueuing: boolean,
) {
  const qm = await getQueueManagerAsync();
  await qm.queue.createAsync(queue, priorityQueuing);
}

export async function produceMessageWithPriority(
  queue: TQueueParams = defaultQueue,
  cfg: IConfig = config,
) {
  const producer = promisifyAll(getProducer(cfg));
  await producer.runAsync();
  const message = new Message();
  message.setPriority(Message.MessagePriority.LOW).setQueue(queue);
  await producer.produceAsync(message);
  return { message, producer, queue };
}

export async function produceMessage(
  queue: TQueueParams = defaultQueue,
  cfg: IConfig = config,
) {
  const producer = getProducer(cfg);
  await producer.runAsync();
  const message = new Message();
  message.setBody({ hello: 'world' }).setQueue(queue);
  await producer.produceAsync(message);
  return { producer, message, queue };
}

export async function produceAndDeadLetterMessage(
  queue: TQueueParams = defaultQueue,
  cfg: IConfig = config,
) {
  const producer = getProducer(cfg);
  const consumer = getConsumer({
    cfg,
    queue,
    messageHandler: jest.fn(() => {
      throw new Error('Explicit error');
    }),
  });

  await producer.runAsync();
  const message = new Message();
  message.setBody({ hello: 'world' }).setQueue(queue);
  await producer.produceAsync(message);

  consumer.run();
  await untilConsumerEvent(consumer, events.MESSAGE_DEAD_LETTERED);
  return { producer, consumer, message, queue };
}

export async function produceAndAcknowledgeMessage(
  queue: TQueueParams = defaultQueue,
  cfg: IConfig = config,
) {
  const producer = getProducer(cfg);
  await producer.runAsync();
  const consumer = getConsumer({
    cfg,
    queue,
    messageHandler: jest.fn((msg, cb) => {
      cb();
    }),
  });

  const message = new Message();
  message.setBody({ hello: 'world' }).setQueue(queue);
  await producer.produceAsync(message);

  consumer.run();
  await untilMessageAcknowledged(consumer);
  return { producer, consumer, queue, message };
}

export async function scheduleMessage(
  queue: TQueueParams = defaultQueue,
  cfg: IConfig = config,
) {
  const producer = promisifyAll(getProducer(cfg));
  await producer.runAsync();
  const message = new Message();
  message.setScheduledDelay(10000).setQueue(queue);
  await producer.produceAsync(message);
  return { message, producer, queue };
}
