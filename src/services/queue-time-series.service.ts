import { QueueTimeSeriesRequestDTO } from '../common/dto/queues/queue-time-series-request.DTO';
import { promisifyAll } from 'bluebird';
import { QueueAcknowledgedTimeSeries } from '../event-listeners/message-rate/consumer/queue-acknowledged-time-series';
import { QueueDeadLetteredTimeSeries } from '../event-listeners/message-rate/consumer/queue-dead-lettered-time-series';
import { QueuePublishedTimeSeries } from '../event-listeners/message-rate/producer/queue-published-time-series';
import { RedisClient } from 'redis-smq-common';
import { TRegistry } from '../lib/registry';

export class QueueTimeSeriesService {
  protected static instance: QueueTimeSeriesService | null = null;
  protected redisClient: RedisClient;

  protected constructor(redisClient: RedisClient) {
    this.redisClient = redisClient;
  }

  async acknowledged(args: QueueTimeSeriesRequestDTO) {
    const { ns, queueName, from, to } = args;
    const timeSeries = promisifyAll(
      QueueAcknowledgedTimeSeries(this.redisClient, {
        name: queueName,
        ns,
      }),
    );
    return timeSeries.getRangeAsync(from, to);
  }

  async deadLettered(args: QueueTimeSeriesRequestDTO) {
    const { ns, queueName, from, to } = args;
    const timeSeries = promisifyAll(
      QueueDeadLetteredTimeSeries(this.redisClient, {
        name: queueName,
        ns,
      }),
    );
    return timeSeries.getRangeAsync(from, to);
  }

  async published(args: QueueTimeSeriesRequestDTO) {
    const { ns, queueName, from, to } = args;
    const timeSeries = promisifyAll(
      QueuePublishedTimeSeries(this.redisClient, {
        name: queueName,
        ns,
      }),
    );
    return timeSeries.getRangeAsync(from, to);
  }

  static async getInstance(registry: TRegistry) {
    if (!QueueTimeSeriesService.instance) {
      const redis = registry.getItem('redis');
      QueueTimeSeriesService.instance = new QueueTimeSeriesService(redis);
    }
    return QueueTimeSeriesService.instance;
  }
}
