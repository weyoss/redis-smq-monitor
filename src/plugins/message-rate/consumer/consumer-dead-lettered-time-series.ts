import { redisKeys } from '../../../common/redis-keys/redis-keys';
import { SortedSetTimeSeries } from '../common/sorted-set-time-series';
import { RedisClient } from 'redis-smq-common';
import { TRedisClientMulti } from 'redis-smq-common/dist/types';

export const ConsumerDeadLetteredTimeSeries = (
  redisClient: RedisClient,
  consumerId: string,
) => {
  const { keyRateConsumerDeadLettered } = redisKeys.getConsumerKeys(consumerId);
  return new SortedSetTimeSeries(redisClient, {
    key: keyRateConsumerDeadLettered,
  });
};

export const deleteConsumerDeadLetteredTimeSeries = (
  multi: TRedisClientMulti,
  consumerId: string,
) => {
  const { keyRateConsumerDeadLettered } = redisKeys.getConsumerKeys(consumerId);
  multi.del(keyRateConsumerDeadLettered);
};
