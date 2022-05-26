import { TQueueParams } from 'redis-smq/dist/types';
import { GlobalAcknowledgedTimeSeries } from '../plugins/message-rate/consumer/global-acknowledged-time-series';
import { GlobalPublishedTimeSeries } from '../plugins/message-rate/producer/global-published-time-series';
import { GlobalDeadLetteredTimeSeries } from '../plugins/message-rate/consumer/global-dead-lettered-time-series';
import { QueueAcknowledgedTimeSeries } from '../plugins/message-rate/consumer/queue-acknowledged-time-series';
import { QueueDeadLetteredTimeSeries } from '../plugins/message-rate/consumer/queue-dead-lettered-time-series';
import { QueuePublishedTimeSeries } from '../plugins/message-rate/producer/queue-published-time-series';
import { ConsumerAcknowledgedTimeSeries } from '../plugins/message-rate/consumer/consumer-acknowledged-time-series';
import { ConsumerDeadLetteredTimeSeries } from '../plugins/message-rate/consumer/consumer-dead-lettered-time-series';
import { Worker, async, RedisClient } from 'redis-smq-common';
import { ICallback } from 'redis-smq-common/dist/types';
import { Consumer, QueueManager } from 'redis-smq';

export class TimeSeriesCleanUpWorker extends Worker {
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

  protected cleanUpGlobalTimeSeries = (cb: ICallback<void>): void => {
    async.waterfall(
      [
        (cb: ICallback<void>) =>
          GlobalAcknowledgedTimeSeries(this.redisClient).cleanUp(cb),
        (cb: ICallback<void>) =>
          GlobalPublishedTimeSeries(this.redisClient).cleanUp(cb),
        (cb: ICallback<void>) =>
          GlobalDeadLetteredTimeSeries(this.redisClient).cleanUp(cb),
      ],
      cb,
    );
  };

  protected cleanUpQueueTimeSeries = (
    queues: TQueueParams[],
    cb: ICallback<void>,
  ): void => {
    async.eachOf(
      queues,
      (queue, _, done) => {
        async.waterfall(
          [
            (cb: ICallback<void>) =>
              QueueAcknowledgedTimeSeries(this.redisClient, queue).cleanUp(cb),
            (cb: ICallback<void>) =>
              QueueDeadLetteredTimeSeries(this.redisClient, queue).cleanUp(cb),
            (cb: ICallback<void>) =>
              QueuePublishedTimeSeries(this.redisClient, queue).cleanUp(cb),
          ],
          done,
        );
      },
      cb,
    );
  };

  protected cleanUpConsumerTimeSeries = (
    consumerIds: string[],
    queue: TQueueParams,
    cb: ICallback<void>,
  ): void => {
    async.eachOf(
      consumerIds,
      (consumerId, _, done) => {
        async.waterfall(
          [
            (cb: ICallback<void>) =>
              ConsumerAcknowledgedTimeSeries(
                this.redisClient,
                consumerId,
              ).cleanUp(cb),
            (cb: ICallback<void>) =>
              ConsumerDeadLetteredTimeSeries(
                this.redisClient,
                consumerId,
              ).cleanUp(cb),
          ],
          done,
        );
      },
      cb,
    );
  };

  work = (cb: ICallback<void>): void => {
    async.waterfall(
      [
        (cb: ICallback<void>) => this.cleanUpGlobalTimeSeries(cb),
        (cb: ICallback<TQueueParams[]>) => {
          this.queueManager.queue.list((err, reply) => {
            if (err) cb(err);
            else {
              const queues = reply ?? [];
              this.cleanUpQueueTimeSeries(queues, (err) => {
                if (err) cb(err);
                else cb(null, queues);
              });
            }
          });
        },
        (queues: TQueueParams[], cb: ICallback<void>) => {
          async.eachOf(
            queues,
            (queue, _, done) => {
              Consumer.getOnlineConsumerIds(
                this.redisClient,
                queue,
                (err, reply) => {
                  if (err) done(err);
                  else {
                    const consumerIds = reply ?? [];
                    this.cleanUpConsumerTimeSeries(consumerIds, queue, done);
                  }
                },
              );
            },
            cb,
          );
        },
      ],
      cb,
    );
  };
}

export default TimeSeriesCleanUpWorker;
