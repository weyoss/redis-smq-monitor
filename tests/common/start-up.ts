import { logger } from 'redis-smq-common';
import { getRedisInstance } from './redis-clients';

export async function startUp(): Promise<void> {
  const redisClient = await getRedisInstance();
  await redisClient.flushallAsync();
  logger.reset();
  logger.setLogger(console);
}
