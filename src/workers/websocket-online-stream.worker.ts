import { TQueueParams } from 'redis-smq/dist/types';
import { Consumer, QueueManager } from 'redis-smq';
import { ICallback } from 'redis-smq-common/dist/types';
import { async, RedisClient, Worker } from 'redis-smq-common';

export class WebsocketOnlineStreamWorker extends Worker {
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

  work = (cb: ICallback<void>): void => {
    async.waterfall(
      [
        (cb: ICallback<TQueueParams[]>) => this.queueManager.queue.list(cb),
        (queues: TQueueParams[], done: ICallback<void>) => {
          async.each(
            queues,
            (item, _, done) => {
              Consumer.getOnlineConsumers(
                this.redisClient,
                item,
                false,
                (err, reply) => {
                  if (err) done(err);
                  else {
                    this.redisClient.publish(
                      `streamOnlineQueueConsumers:${item.ns}:${item.name}`,
                      JSON.stringify(reply ?? {}),
                      () => done(),
                    );
                  }
                },
              );
            },
            done,
          );
        },
      ],
      cb,
    );
  };
}

export default WebsocketOnlineStreamWorker;
