import { promisifyAll } from 'bluebird';
import { GetConsumerAcknowledgedRequestDTO } from '../controllers/api/consumers/consumer/time-series/get-consumer-acknowledged/get-consumer-acknowledged.request.DTO';
import { GetConsumerDeadLetteredRequestDTO } from '../controllers/api/consumers/consumer/time-series/get-consumer-dead-lettered/get-consumer-dead-lettered.request.DTO';
import { ConsumerDeadLetteredTimeSeries } from '../plugins/message-rate/consumer/consumer-dead-lettered-time-series';
import { ConsumerAcknowledgedTimeSeries } from '../plugins/message-rate/consumer/consumer-acknowledged-time-series';
import { RedisClient } from 'redis-smq-common';
import { TRegistry } from '../lib/registry';

export class ConsumerTimeSeriesService {
  protected static instance: ConsumerTimeSeriesService | null = null;
  protected redisClient: RedisClient;

  protected constructor(redisClient: RedisClient) {
    this.redisClient = redisClient;
  }

  async acknowledged(args: GetConsumerAcknowledgedRequestDTO) {
    const { from, to, consumerId } = args;
    const timeSeries = promisifyAll(
      ConsumerAcknowledgedTimeSeries(this.redisClient, consumerId),
    );
    return timeSeries.getRangeAsync(from, to);
  }

  async deadLettered(args: GetConsumerDeadLetteredRequestDTO) {
    const { from, to, consumerId } = args;
    const timeSeries = promisifyAll(
      ConsumerDeadLetteredTimeSeries(this.redisClient, consumerId),
    );
    return timeSeries.getRangeAsync(from, to);
  }

  static async getInstance(registry: TRegistry) {
    if (!ConsumerTimeSeriesService.instance) {
      const redis = registry.getItem('redis');
      ConsumerTimeSeriesService.instance = new ConsumerTimeSeriesService(redis);
    }
    return ConsumerTimeSeriesService.instance;
  }
}
