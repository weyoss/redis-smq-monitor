import { TQueueParams, IPlugin } from 'redis-smq/dist/types';
import { ConsumerMessageRate } from './consumer/consumer-message-rate';
import { ConsumerMessageRateWriter } from './consumer/consumer-message-rate-writer';
import { Consumer, events } from 'redis-smq';
import { RedisClient } from 'redis-smq-common';
import { ICallback } from 'redis-smq-common/dist/types';

export class ConsumerMessageRatePlugin implements IPlugin {
  protected consumerMessageRate: ConsumerMessageRate;

  constructor(
    redisClient: RedisClient,
    queue: TQueueParams,
    consumer: Consumer,
  ) {
    const writer = new ConsumerMessageRateWriter(
      redisClient,
      queue,
      consumer.getId(),
    );
    this.consumerMessageRate = new ConsumerMessageRate(writer);
    consumer.on(events.MESSAGE_ACKNOWLEDGED, () =>
      this.consumerMessageRate.incrementAcknowledged(),
    );
    consumer.on(events.MESSAGE_DEAD_LETTERED, () =>
      this.consumerMessageRate.incrementDeadLettered(),
    );
  }

  quit(cb: ICallback<void>): void {
    this.consumerMessageRate.quit(cb);
  }
}
