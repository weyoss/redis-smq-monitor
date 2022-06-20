import { IConfig } from 'redis-smq/dist/types';
import { ConsumerEventListener, ProducerEventListener } from '../..'; // from 'redis-smq-monitor'

export const config: IConfig = {
  logger: {
    enabled: false,
  },
  messages: {
    store: true,
  },
  eventListeners: {
    consumerEventListeners: [ConsumerEventListener],
    producerEventListeners: [ProducerEventListener],
  },
};
