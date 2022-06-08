import {
  TQueueParams,
  IEventListener,
  IEventProvider,
} from 'redis-smq/dist/types';
import { ConsumerMessageRate } from './consumer/consumer-message-rate';
import { ConsumerMessageRateWriter } from './consumer/consumer-message-rate-writer';
import { events } from 'redis-smq';
import { RedisClient } from 'redis-smq-common';
import { ICallback } from 'redis-smq-common/dist/types';

export class ConsumerEventListener implements IEventListener {
  protected consumerMessageRate: ConsumerMessageRate;

  constructor(
    redisClient: RedisClient,
    consumerId: string,
    queue: TQueueParams,
    eventProvider: IEventProvider,
  ) {
    const writer = new ConsumerMessageRateWriter(
      redisClient,
      queue,
      consumerId,
    );
    this.consumerMessageRate = new ConsumerMessageRate(writer);
    eventProvider.on(events.MESSAGE_ACKNOWLEDGED, () =>
      this.consumerMessageRate.incrementAcknowledged(),
    );
    eventProvider.on(events.MESSAGE_DEAD_LETTERED, () =>
      this.consumerMessageRate.incrementDeadLettered(),
    );
  }

  quit(cb: ICallback<void>): void {
    this.consumerMessageRate.quit(cb);
  }
}
