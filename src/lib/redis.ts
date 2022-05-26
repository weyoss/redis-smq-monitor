import { RedisClientName } from 'redis-smq-common/dist/types';
import { promisifyAll } from 'bluebird';
import { RedisClient } from 'redis-smq-common';
import { TConfig } from '../../types';

const RedisClientAsync = promisifyAll(RedisClient);

export async function createRedisInstance(config: TConfig) {
  const redis = config.redis ?? {
    client: RedisClientName.REDIS,
  };
  return RedisClientAsync.getNewInstanceAsync(redis);
}
