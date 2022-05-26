import { redisKeys } from '../../../common/redis-keys/redis-keys';
import { HashTimeSeries } from '../common/hash-time-series';
import { RedisClient } from 'redis-smq-common';

export const GlobalAcknowledgedTimeSeries = (redisClient: RedisClient) => {
  const { keyRateGlobalAcknowledged, keyRateGlobalAcknowledgedIndex } =
    redisKeys.getMainKeys();
  return new HashTimeSeries(redisClient, {
    key: keyRateGlobalAcknowledged,
    indexKey: keyRateGlobalAcknowledgedIndex,
  });
};
