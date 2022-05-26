import { IConfig } from 'redis-smq/dist/types';
import { config } from './config';
import { events, Producer } from 'redis-smq';
import { promisifyAll } from 'bluebird';

let producersList: Producer[] = [];

export function getProducer(cfg: IConfig = config) {
  const producer = new Producer(cfg);
  const p = promisifyAll(producer);
  producersList.push(p);
  return p;
}

export async function shutdownProducers() {
  for (const i of producersList) {
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
  producersList = [];
}
