import { config } from './config';
import { promisifyAll } from 'bluebird';
import { Consumer, events } from 'redis-smq';
import {
  IConfig,
  TConsumerMessageHandler,
  TQueueParams,
} from 'redis-smq/dist/types';
import { defaultQueue } from './common';

type TGetConsumerArgs = {
  queue?: string | TQueueParams;
  messageHandler?: TConsumerMessageHandler;
  cfg?: IConfig;
};

let consumersList: Consumer[] = [];

export function getConsumer(args: TGetConsumerArgs = {}) {
  const {
    queue = defaultQueue,
    messageHandler = (msg, cb) => cb(),
    cfg = config,
  } = args;
  const consumer = promisifyAll(new Consumer(cfg));
  consumer.consume(queue, messageHandler, () => void 0);
  consumersList.push(consumer);
  return consumer;
}

export async function shutdownConsumers() {
  for (const i of consumersList) {
    if (i.isGoingUp()) {
      await new Promise((resolve) => {
        i.once(events.UP, resolve);
      });
    }
    if (i.isRunning()) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        i.shutdown(resolve);
      });
    }
  }
  consumersList = [];
}
