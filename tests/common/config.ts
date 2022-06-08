import { IConfig as IRedisSMQConfig } from 'redis-smq/dist/types';
import { TConfig } from '../../types';
import {
  RedisClientName,
  TLoggerConfig,
  TRedisConfig,
} from 'redis-smq-common/dist/types';
import { ConsumerEventListener, ProducerEventListener } from '../..';

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = Number(process.env.REDIS_PORT) || 6379;

const redis: TRedisConfig = {
  client: RedisClientName.IOREDIS,
  options: {
    host: redisHost,
    port: redisPort,
    showFriendlyErrorStack: true,
  },
};

const logger: TLoggerConfig = {
  enabled: false,
};

export const config: IRedisSMQConfig = {
  redis,
  logger,
  namespace: 'testing',
  messages: {
    store: true,
  },
  eventListeners: {
    consumerEventListeners: [ConsumerEventListener],
    producerEventListeners: [ProducerEventListener],
  },
};

export const monitorConfig: TConfig = {
  redis,
  logger,
  server: {
    host: '127.0.0.1',
    port: 3000,
  },
};
