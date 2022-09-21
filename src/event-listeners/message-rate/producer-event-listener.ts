import { ProducerMessageRate } from './producer/producer-message-rate';
import { ProducerMessageRateWriter } from './producer/producer-message-rate-writer';
import { events, Message } from 'redis-smq';
import { ICallback } from 'redis-smq-common/dist/types';
import {
  async,
  createClientInstance,
  errors,
  RedisClient,
} from 'redis-smq-common';
import { EventEmitter } from 'events';
import { IEventListener, TEventListenerInitArgs } from 'redis-smq/dist/types';

export class ProducerEventListener implements IEventListener {
  protected producerMessageRate: ProducerMessageRate | null = null;
  protected redisClient: RedisClient | null = null;
  protected eventProvider: EventEmitter | null = null;

  protected onMessagePublished = (message: Message): void => {
    this.producerMessageRate?.incrementPublished(message.getDestinationQueue());
  };

  init(args: TEventListenerInitArgs, cb: ICallback<void>): void {
    const { config, eventProvider } = args;
    this.eventProvider = eventProvider;
    createClientInstance(config.redis, (err, redisClient) => {
      if (err) cb(err);
      else if (!redisClient) cb(new errors.EmptyCallbackReplyError());
      else {
        this.redisClient = redisClient;
        const writer = new ProducerMessageRateWriter(redisClient);
        this.producerMessageRate = new ProducerMessageRate(writer);
        eventProvider.on(events.MESSAGE_PUBLISHED, this.onMessagePublished);
        cb();
      }
    });
  }

  quit(cb: ICallback<void>): void {
    this.eventProvider?.removeListener(
      events.MESSAGE_PUBLISHED,
      this.onMessagePublished,
    );
    async.waterfall(
      [
        (cb: ICallback<void>) => {
          if (this.producerMessageRate) this.producerMessageRate.quit(cb);
          else cb();
        },
        (cb: ICallback<void>) => {
          if (this.redisClient) this.redisClient.halt(cb);
          else cb();
        },
      ],
      cb,
    );
  }
}
