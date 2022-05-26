import { RedisClient } from 'redis-smq-common';
import { promisifyAll } from 'bluebird';
import { config } from './config';
import { RedisClientName } from 'redis-smq-common/dist/types';

const redisClients: RedisClient[] = [];

export async function getRedisInstance() {
  const RedisClientAsync = promisifyAll(RedisClient);
  const c = promisifyAll(
    await RedisClientAsync.getNewInstanceAsync(
      config.redis ?? { client: RedisClientName.REDIS },
    ),
  );
  redisClients.push(c);
  return c;
}

export async function shutdownRedisClients() {
  while (redisClients.length) {
    const redisClient = redisClients.pop();
    if (redisClient) {
      await promisifyAll(redisClient).haltAsync();
    }
  }
}
