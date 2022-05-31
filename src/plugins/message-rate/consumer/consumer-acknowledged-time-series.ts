import { redisKeys } from '../../../common/redis-keys/redis-keys';
import { SortedSetTimeSeries } from '../common/sorted-set-time-series';
import { RedisClient } from 'redis-smq-common';
import { IRedisClientMulti } from 'redis-smq-common/dist/types';

export const ConsumerAcknowledgedTimeSeries = (
  redisClient: RedisClient,
  consumerId: string,
) => {
  const { keyRateConsumerAcknowledged } = redisKeys.getConsumerKeys(consumerId);
  return new SortedSetTimeSeries(redisClient, {
    key: keyRateConsumerAcknowledged,
  });
};

export const deleteConsumerAcknowledgedTimeSeries = (
  multi: IRedisClientMulti,
  consumerId: string,
) => {
  const { keyRateConsumerAcknowledged } = redisKeys.getConsumerKeys(consumerId);
  multi.del(keyRateConsumerAcknowledged);
};
