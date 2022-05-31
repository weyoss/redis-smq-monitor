import { RedisClientName, TRedisConfig } from 'redis-smq-common/dist/types';
import { createClientInstance } from 'redis-smq-common';
import { TConfig } from '../../types';
import { promisify } from 'bluebird';

const createClientInstanceAsync = promisify(createClientInstance);

export async function createRedisInstance(config: TConfig) {
  const redis: TRedisConfig = config.redis ?? {
    client: RedisClientName.REDIS,
  };
  return createClientInstanceAsync(redis);
}
