import { ConsumerAcknowledgedTimeSeries } from './consumer-acknowledged-time-series';
import { ConsumerDeadLetteredTimeSeries } from './consumer-dead-lettered-time-series';
import { QueueAcknowledgedTimeSeries } from './queue-acknowledged-time-series';
import { QueueDeadLetteredTimeSeries } from './queue-dead-lettered-time-series';
import { GlobalAcknowledgedTimeSeries } from './global-acknowledged-time-series';
import { GlobalDeadLetteredTimeSeries } from './global-dead-lettered-time-series';
import { MessageRateWriter } from '../common/message-rate-writer';
import { TQueueParams } from 'redis-smq/dist/types';
import { IConsumerMessageRateFields } from '../../../../types';
import { RedisClient } from 'redis-smq-common';
import { ICallback, TRedisClientMulti } from 'redis-smq-common/dist/types';

export class ConsumerMessageRateWriter extends MessageRateWriter<IConsumerMessageRateFields> {
  protected redisClient: RedisClient;
  protected acknowledgedTimeSeries: ReturnType<
    typeof ConsumerAcknowledgedTimeSeries
  >;
  protected deadLetteredTimeSeries: ReturnType<
    typeof ConsumerDeadLetteredTimeSeries
  >;
  protected queueAcknowledgedRateTimeSeries: ReturnType<
    typeof QueueAcknowledgedTimeSeries
  >;
  protected queueDeadLetteredTimeSeries: ReturnType<
    typeof QueueDeadLetteredTimeSeries
  >;
  protected globalAcknowledgedRateTimeSeries: ReturnType<
    typeof GlobalAcknowledgedTimeSeries
  >;
  protected globalDeadLetteredTimeSeries: ReturnType<
    typeof GlobalDeadLetteredTimeSeries
  >;
  constructor(
    redisClient: RedisClient,
    queue: TQueueParams,
    consumerId: string,
  ) {
    super();
    this.redisClient = redisClient;
    this.globalAcknowledgedRateTimeSeries =
      GlobalAcknowledgedTimeSeries(redisClient);
    this.globalDeadLetteredTimeSeries =
      GlobalDeadLetteredTimeSeries(redisClient);
    this.acknowledgedTimeSeries = ConsumerAcknowledgedTimeSeries(
      redisClient,
      consumerId,
    );
    this.deadLetteredTimeSeries = ConsumerDeadLetteredTimeSeries(
      redisClient,
      consumerId,
    );
    this.queueAcknowledgedRateTimeSeries = QueueAcknowledgedTimeSeries(
      redisClient,
      queue,
    );
    this.queueDeadLetteredTimeSeries = QueueDeadLetteredTimeSeries(
      redisClient,
      queue,
    );
  }

  onUpdate(
    ts: number,
    rates: IConsumerMessageRateFields,
    cb: ICallback<void>,
  ): void {
    let multi: TRedisClientMulti | null = null;
    for (const field in rates) {
      multi = multi ?? this.redisClient.multi();
      const value: number = rates[field];
      if (value) {
        if (field === 'acknowledgedRate') {
          this.acknowledgedTimeSeries.add(ts, value, multi);
          this.queueAcknowledgedRateTimeSeries.add(ts, value, multi);
          this.globalAcknowledgedRateTimeSeries.add(ts, value, multi);
        } else {
          this.deadLetteredTimeSeries.add(ts, value, multi);
          this.queueDeadLetteredTimeSeries.add(ts, value, multi);
          this.globalDeadLetteredTimeSeries.add(ts, value, multi);
        }
      }
    }
    if (multi) this.redisClient.execMulti(multi, () => cb());
    else cb();
  }
}
