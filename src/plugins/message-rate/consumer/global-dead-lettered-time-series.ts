import { redisKeys } from '../../../common/redis-keys/redis-keys';
import { HashTimeSeries } from '../common/hash-time-series';
import { RedisClient } from 'redis-smq-common';

export const GlobalDeadLetteredTimeSeries = (redisClient: RedisClient) => {
  const { keyRateGlobalDeadLettered, keyRateGlobalDeadLetteredIndex } =
    redisKeys.getMainKeys();
  return new HashTimeSeries(redisClient, {
    key: keyRateGlobalDeadLettered,
    indexKey: keyRateGlobalDeadLetteredIndex,
  });
};
