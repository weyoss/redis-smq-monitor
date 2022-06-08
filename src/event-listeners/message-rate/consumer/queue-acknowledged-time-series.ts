import { redisKeys } from '../../../common/redis-keys/redis-keys';
import { TQueueParams } from 'redis-smq/dist/types';
import { HashTimeSeries } from '../common/hash-time-series';
import { RedisClient } from 'redis-smq-common';

export const QueueAcknowledgedTimeSeries = (
  redisClient: RedisClient,
  queue: TQueueParams,
) => {
  const { keyRateQueueAcknowledged, keyRateQueueAcknowledgedIndex } =
    redisKeys.getQueueKeys(queue);
  return new HashTimeSeries(redisClient, {
    key: keyRateQueueAcknowledged,
    indexKey: keyRateQueueAcknowledgedIndex,
  });
};
