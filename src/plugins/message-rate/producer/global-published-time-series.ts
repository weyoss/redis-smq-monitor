import { redisKeys } from '../../../common/redis-keys/redis-keys';
import { HashTimeSeries } from '../common/hash-time-series';
import { RedisClient } from 'redis-smq-common';

export const GlobalPublishedTimeSeries = (redisClient: RedisClient) => {
  const { keyRateGlobalPublished, keyRateGlobalInputIndex } =
    redisKeys.getMainKeys();
  return new HashTimeSeries(redisClient, {
    key: keyRateGlobalPublished,
    indexKey: keyRateGlobalInputIndex,
  });
};
