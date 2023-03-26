import {
  TConsumerHeartbeat,
  TConsumerInfo,
  TQueueParams,
} from 'redis-smq/dist/types';
import { Consumer, QueueManager } from 'redis-smq';
import { ICallback } from 'redis-smq-common/dist/types';
import { async, RedisClient, Worker } from 'redis-smq-common';

type TQueueConsumersInfo = Record<string, string | TConsumerInfo>;
type TConsumersHeartbeats = Record<string, false | TConsumerHeartbeat>;

/**
 * Provides the following streams:
 * - streamQueueConsumers:${queue.ns}:${queue.name}
 * - streamConsumerHeartbeat:${consumerId}
 * - streamQueueOnlineConsumers:${queue.ns}:${queue.name}
 * - streamOnlineConsumers
 */
export class WebsocketConsumersStreamWorker extends Worker {
  protected queueManager: QueueManager;
  protected redisClient: RedisClient;
  protected consumersHeartbeats: TConsumersHeartbeats = {};
  protected onlineConsumers: string[] = [];

  constructor(
    redisClient: RedisClient,
    queueManager: QueueManager,
    managed: boolean,
  ) {
    super(managed);
    this.queueManager = queueManager;
    this.redisClient = redisClient;
  }

  protected handleQueueConsumers = (
    queue: TQueueParams,
    cb: ICallback<Record<string, string | TConsumerInfo>>,
  ): void => {
    Consumer.getQueueConsumers(this.redisClient, queue, false, (err, reply) => {
      if (err) cb(err);
      else {
        const queueConsumers: TQueueConsumersInfo = reply ?? {};
        this.redisClient.publish(
          `streamQueueConsumers:${queue.ns}:${queue.name}`,
          JSON.stringify(queueConsumers),
          () => cb(null, queueConsumers),
        );
      }
    });
  };

  protected handleQueueConsumersHeartbeats = (
    queue: TQueueParams,
    queueConsumers: TQueueConsumersInfo,
    cb: ICallback<void>,
  ): void => {
    const queueOnlineConsumers: string[] = [];
    async.eachIn(
      queueConsumers,
      (consumerInfo, consumerId, done) => {
        if (this.consumersHeartbeats.hasOwnProperty(consumerId)) {
          if (this.consumersHeartbeats[consumerId])
            queueOnlineConsumers.push(consumerId);
          done();
        } else {
          Consumer.getConsumerHeartbeat(
            this.redisClient,
            consumerId,
            (err, heartbeat) => {
              if (err) done(err);
              else if (heartbeat) {
                this.consumersHeartbeats[consumerId] = heartbeat;
                this.onlineConsumers.push(consumerId);
                queueOnlineConsumers.push(consumerId);
                this.redisClient.publish(
                  `streamConsumerHeartbeat:${consumerId}`,
                  JSON.stringify(heartbeat),
                  () => done(),
                );
              } else {
                this.consumersHeartbeats[consumerId] = false;
                done();
              }
            },
          );
        }
      },
      (err) => {
        if (err) cb(err);
        else {
          this.redisClient.publish(
            `streamQueueOnlineConsumers:${queue.ns}:${queue.name}`,
            JSON.stringify({ ids: queueOnlineConsumers }),
            () => cb(),
          );
        }
      },
    );
  };

  work = (cb: ICallback<void>): void => {
    this.consumersHeartbeats = {};
    this.onlineConsumers = [];
    async.waterfall(
      [
        (cb: ICallback<TQueueParams[]>) => this.queueManager.queue.list(cb),
        (queues: TQueueParams[], cb: ICallback<void>) => {
          async.eachOf(
            queues,
            (queue, _, done) => {
              async.waterfall(
                [
                  (cb: ICallback<TQueueConsumersInfo>) => {
                    this.handleQueueConsumers(queue, cb);
                  },
                  (
                    queueConsumers: TQueueConsumersInfo,
                    cb: ICallback<void>,
                  ) => {
                    this.handleQueueConsumersHeartbeats(
                      queue,
                      queueConsumers,
                      cb,
                    );
                  },
                  (cb: ICallback<void>) => {
                    this.redisClient.publish(
                      `streamOnlineConsumers`,
                      JSON.stringify({ ids: this.onlineConsumers }),
                      () => cb(),
                    );
                  },
                ],
                done,
              );
            },
            cb,
          );
        },
      ],
      (err) => cb(err),
    );
  };
}

export default WebsocketConsumersStreamWorker;
