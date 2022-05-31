import { RedisClient, createClientInstance } from 'redis-smq-common';
import { promisifyAll } from 'bluebird';
import { config } from './config';
import { RedisClientName } from 'redis-smq-common/dist/types';
import { promisify } from 'bluebird';

const redisClients: RedisClient[] = [];
const createClientInstanceAsync = promisify(createClientInstance);

export async function getRedisInstance() {
  const c = promisifyAll(
    await createClientInstanceAsync(
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
