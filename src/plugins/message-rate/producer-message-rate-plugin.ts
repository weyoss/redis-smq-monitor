import { IPlugin } from 'redis-smq/dist/types';
import { ProducerMessageRate } from './producer/producer-message-rate';
import { ProducerMessageRateWriter } from './producer/producer-message-rate-writer';
import { events, Message, Producer } from 'redis-smq';
import { ICallback } from 'redis-smq-common/dist/types';
import { RedisClient } from 'redis-smq-common';

export class ProducerMessageRatePlugin implements IPlugin {
  protected producerMessageRate: ProducerMessageRate;

  constructor(redisClient: RedisClient, producer: Producer) {
    const writer = new ProducerMessageRateWriter(redisClient);
    this.producerMessageRate = new ProducerMessageRate(writer);
    producer.on(events.MESSAGE_PUBLISHED, (message: Message) => {
      this.producerMessageRate.incrementPublished(message.getRequiredQueue());
    });
  }

  quit(cb: ICallback<void>): void {
    this.producerMessageRate.quit(cb);
  }
}
