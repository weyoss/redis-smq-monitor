import {
  IEventListener,
  TEventListenerInitArgs,
  TQueueParams,
} from 'redis-smq/dist/types';
import { ConsumerMessageRate } from './consumer/consumer-message-rate';
import { ConsumerMessageRateWriter } from './consumer/consumer-message-rate-writer';
import { events, Message } from 'redis-smq';
import {
  async,
  createClientInstance,
  errors,
  RedisClient,
} from 'redis-smq-common';
import { ICallback } from 'redis-smq-common/dist/types';
import { EventEmitter } from 'events';

export class ConsumerEventListener implements IEventListener {
  protected consumerId: string | null = null;
  protected consumerMessageRate = new Map<TQueueParams, ConsumerMessageRate>();
  protected redisClient: RedisClient | null = null;
  protected eventProvider: EventEmitter | null = null;

  protected onMessageAcknowledged = (message: Message): void => {
    this.getMessageRate(
      message.getDestinationQueue(),
      String(this.consumerId),
    ).incrementAcknowledged();
  };

  protected onMessageDeadLettered = (message: Message): void => {
    this.getMessageRate(
      message.getDestinationQueue(),
      String(this.consumerId),
    ).incrementDeadLettered();
  };

  protected getMessageRate(
    queue: TQueueParams,
    consumerId: string,
  ): ConsumerMessageRate {
    let messageRate = this.consumerMessageRate.get(queue);
    if (!messageRate) {
      const redisClient = this.getRedisClient();
      this.redisClient = redisClient;
      const writer = new ConsumerMessageRateWriter(
        redisClient,
        queue,
        consumerId,
      );
      messageRate = new ConsumerMessageRate(writer);
      this.consumerMessageRate.set(queue, messageRate);
    }
    return messageRate;
  }

  protected getRedisClient(): RedisClient {
    if (!this.redisClient)
      throw new errors.PanicError('Expected a RedisClient instance');
    return this.redisClient;
  }

  init(args: TEventListenerInitArgs, cb: ICallback<void>): void {
    const { instanceId, config, eventProvider } = args;
    this.consumerId = instanceId;
    this.eventProvider = eventProvider;
    createClientInstance(config.redis, (err, redisClient) => {
      if (err) cb(err);
      else if (!redisClient) cb(new errors.EmptyCallbackReplyError());
      else {
        this.redisClient = redisClient;
        eventProvider.on(
          events.MESSAGE_ACKNOWLEDGED,
          this.onMessageAcknowledged,
        );
        eventProvider.on(
          events.MESSAGE_DEAD_LETTERED,
          this.onMessageDeadLettered,
        );
        cb();
      }
    });
  }

  quit(cb: ICallback<void>): void {
    this.eventProvider?.removeListener(
      events.MESSAGE_ACKNOWLEDGED,
      this.onMessageAcknowledged,
    );
    this.eventProvider?.removeListener(
      events.MESSAGE_DEAD_LETTERED,
      this.onMessageDeadLettered,
    );
    async.waterfall(
      [
        (cb: ICallback<void>) => {
          async.eachOf(
            [...this.consumerMessageRate.values()],
            (messageRate, idx, done) => messageRate.quit(done),
            (err) => {
              if (err) cb(err);
              else {
                this.consumerMessageRate.clear();
                cb();
              }
            },
          );
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
