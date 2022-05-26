import { promisifyAll } from 'bluebird';
import { TimeSeriesRequestDTO } from '../common/dto/time-series/time-series-request.DTO';
import { GlobalAcknowledgedTimeSeries } from '../plugins/message-rate/consumer/global-acknowledged-time-series';
import { GlobalDeadLetteredTimeSeries } from '../plugins/message-rate/consumer/global-dead-lettered-time-series';
import { GlobalPublishedTimeSeries } from '../plugins/message-rate/producer/global-published-time-series';
import { RedisClient } from 'redis-smq-common';
import { TRegistry } from '../lib/registry';

export class GlobalTimeSeriesService {
  protected static instance: GlobalTimeSeriesService | null = null;
  protected redisClient: RedisClient;

  protected constructor(redisClient: RedisClient) {
    this.redisClient = redisClient;
  }

  async acknowledged(args: TimeSeriesRequestDTO) {
    const { from, to } = args;
    const timeSeries = promisifyAll(
      GlobalAcknowledgedTimeSeries(this.redisClient),
    );
    return timeSeries.getRangeAsync(from, to);
  }

  async deadLettered(args: TimeSeriesRequestDTO) {
    const { from, to } = args;
    const timeSeries = promisifyAll(
      GlobalDeadLetteredTimeSeries(this.redisClient),
    );
    return timeSeries.getRangeAsync(from, to);
  }

  async published(args: TimeSeriesRequestDTO) {
    const { from, to } = args;
    const timeSeries = promisifyAll(
      GlobalPublishedTimeSeries(this.redisClient),
    );
    return timeSeries.getRangeAsync(from, to);
  }

  static async getInstance(registry: TRegistry) {
    if (!GlobalTimeSeriesService.instance) {
      const redis = registry.getItem('redis');
      GlobalTimeSeriesService.instance = new GlobalTimeSeriesService(redis);
    }
    return GlobalTimeSeriesService.instance;
  }
}
