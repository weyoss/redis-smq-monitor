import { TQueueParams } from 'redis-smq/dist/types';
import { GlobalAcknowledgedTimeSeries } from '../event-listeners/message-rate/consumer/global-acknowledged-time-series';
import { GlobalPublishedTimeSeries } from '../event-listeners/message-rate/producer/global-published-time-series';
import { GlobalDeadLetteredTimeSeries } from '../event-listeners/message-rate/consumer/global-dead-lettered-time-series';
import { QueueAcknowledgedTimeSeries } from '../event-listeners/message-rate/consumer/queue-acknowledged-time-series';
import { QueueDeadLetteredTimeSeries } from '../event-listeners/message-rate/consumer/queue-dead-lettered-time-series';
import { QueuePublishedTimeSeries } from '../event-listeners/message-rate/producer/queue-published-time-series';
import { ConsumerAcknowledgedTimeSeries } from '../event-listeners/message-rate/consumer/consumer-acknowledged-time-series';
import { ConsumerDeadLetteredTimeSeries } from '../event-listeners/message-rate/consumer/consumer-dead-lettered-time-series';
import { async, RedisClient, Worker } from 'redis-smq-common';
import { ICallback } from 'redis-smq-common/dist/types';
import { QueueManager, Consumer } from 'redis-smq';

export class WebsocketRateStreamWorker extends Worker {
  protected timestamp = 0;
  protected queueManager: QueueManager;
  protected redisClient: RedisClient;

  constructor(
    redisClient: RedisClient,
    queueManager: QueueManager,
    managed: boolean,
  ) {
    super(managed);
    this.queueManager = queueManager;
    this.redisClient = redisClient;
  }

  protected publishConsumerTimeSeries = (
    queue: TQueueParams,
    consumerId: string,
    cb: ICallback<void>,
  ): void => {
    async.waterfall(
      [
        (cb: ICallback<void>) =>
          ConsumerAcknowledgedTimeSeries(
            this.redisClient,
            consumerId,
          ).getRangeFrom(this.timestamp, (err, reply) => {
            if (err) cb(err);
            else {
              this.redisClient.publish(
                `streamConsumerAcknowledged:${consumerId}`,
                JSON.stringify(reply),
                () => cb(),
              );
            }
          }),
        (cb: ICallback<void>) =>
          ConsumerDeadLetteredTimeSeries(
            this.redisClient,
            consumerId,
          ).getRangeFrom(this.timestamp, (err, reply) => {
            if (err) cb(err);
            else {
              this.redisClient.publish(
                `streamConsumerDeadLettered:${consumerId}`,
                JSON.stringify(reply),
                () => cb(),
              );
            }
          }),
      ],
      cb,
    );
  };

  protected publishQueueTimeSeries = (
    queue: TQueueParams,
    cb: ICallback<void>,
  ): void => {
    async.waterfall(
      [
        (cb: ICallback<void>) =>
          QueueAcknowledgedTimeSeries(this.redisClient, queue).getRangeFrom(
            this.timestamp,
            (err, reply) => {
              if (err) cb(err);
              else {
                this.redisClient.publish(
                  `streamQueueAcknowledged:${queue.ns}:${queue.name}`,
                  JSON.stringify(reply),
                  () => cb(),
                );
              }
            },
          ),
        (cb: ICallback<void>) =>
          QueueDeadLetteredTimeSeries(this.redisClient, queue).getRangeFrom(
            this.timestamp,
            (err, reply) => {
              if (err) cb(err);
              else {
                this.redisClient.publish(
                  `streamQueueDeadLettered:${queue.ns}:${queue.name}`,
                  JSON.stringify(reply),
                  () => cb(),
                );
              }
            },
          ),
        (cb: ICallback<void>) =>
          QueuePublishedTimeSeries(this.redisClient, queue).getRangeFrom(
            this.timestamp,
            (err, reply) => {
              if (err) cb(err);
              else {
                this.redisClient.publish(
                  `streamQueuePublished:${queue.ns}:${queue.name}`,
                  JSON.stringify(reply),
                  () => cb(),
                );
              }
            },
          ),
      ],
      cb,
    );
  };

  protected handleGlobalTimeSeries = (cb: ICallback<void>): void => {
    async.waterfall(
      [
        (cb: ICallback<void>) =>
          GlobalAcknowledgedTimeSeries(this.redisClient).getRangeFrom(
            this.timestamp,
            (err, reply) => {
              if (err) cb(err);
              else {
                this.redisClient.publish(
                  'streamGlobalAcknowledged',
                  JSON.stringify(reply),
                  () => cb(),
                );
              }
            },
          ),
        (cb: ICallback<void>) =>
          GlobalDeadLetteredTimeSeries(this.redisClient).getRangeFrom(
            this.timestamp,
            (err, reply) => {
              if (err) cb(err);
              else {
                this.redisClient.publish(
                  'streamGlobalDeadLettered',
                  JSON.stringify(reply),
                  () => cb(),
                );
              }
            },
          ),
        (cb: ICallback<void>) =>
          GlobalPublishedTimeSeries(this.redisClient).getRangeFrom(
            this.timestamp,
            (err, reply) => {
              if (err) cb(err);
              else {
                this.redisClient.publish(
                  'streamGlobalPublished',
                  JSON.stringify(reply),
                  () => cb(),
                );
              }
            },
          ),
      ],
      cb,
    );
  };

  protected handleConsumersTimeSeries = (
    queues: TQueueParams[],
    cb: ICallback<void>,
  ): void => {
    async.each(
      queues,
      (queueParams, idx, done) => {
        Consumer.getOnlineConsumerIds(
          this.redisClient,
          queueParams,
          (err, ids) => {
            if (err) done(err);
            else {
              async.each(
                ids ?? [],
                (consumerId, idx, done) => {
                  this.publishConsumerTimeSeries(queueParams, consumerId, done);
                },
                done,
              );
            }
          },
        );
      },
      cb,
    );
  };

  protected handleQueuesTimeSeries = (cb: ICallback<TQueueParams[]>): void => {
    this.queueManager.queue.list((err, reply) => {
      if (err) cb(err);
      else {
        const queues = reply ?? [];
        async.each(
          queues,
          (queue, index, done) => {
            this.publishQueueTimeSeries(queue, done);
          },
          (err) => {
            if (err) cb(err);
            else cb(null, queues);
          },
        );
      }
    });
  };

  work = (cb: ICallback<void>): void => {
    if (!this.timestamp)
      // in secs
      this.timestamp = Math.ceil(Date.now() / 1000);
    else this.timestamp += 1;
    async.waterfall(
      [
        this.handleGlobalTimeSeries,
        this.handleQueuesTimeSeries,
        this.handleConsumersTimeSeries,
      ],
      cb,
    );
  };
}

export default WebsocketRateStreamWorker;
