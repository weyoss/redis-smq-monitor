import { TConfig } from '../../types';
import { RedisClientName } from 'redis-smq-common/dist/types';
import { ConsumerEventListener, ProducerEventListener } from '../..';

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = Number(process.env.REDIS_PORT) || 6379;

export const config: TConfig = {
  namespace: 'testing',
  messages: {
    store: true,
  },
  eventListeners: {
    consumerEventListeners: [ConsumerEventListener],
    producerEventListeners: [ProducerEventListener],
  },
  redis: {
    client: RedisClientName.IOREDIS,
    options: {
      host: redisHost,
      port: redisPort,
      showFriendlyErrorStack: true,
    },
  },
  logger: {
    enabled: false,
  },
  server: {
    host: '127.0.0.1',
    port: 3000,
  },
};
