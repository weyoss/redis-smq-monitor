import { TQueueParams, TQueueSettings } from 'redis-smq/dist/types';
import {
  TWebsocketMainStreamPayload,
  TWebsocketMainStreamPayloadQueue,
} from '../../types';
import { async, errors, RedisClient, Worker } from 'redis-smq-common';
import { ICallback } from 'redis-smq-common/dist/types';
import { Consumer, MessageManager, QueueManager } from 'redis-smq';

export class WebsocketMainStreamWorker extends Worker {
  protected data: TWebsocketMainStreamPayload = {
    scheduledMessagesCount: 0,
    deadLetteredMessagesCount: 0,
    pendingMessagesCount: 0,
    acknowledgedMessagesCount: 0,
    consumersCount: 0,
    queuesCount: 0,
    queues: {},
  };
  protected queueManager: QueueManager;
  protected messageManager: MessageManager;
  protected redisClient: RedisClient;

  constructor(
    redisClient: RedisClient,
    messageManager: MessageManager,
    queueManager: QueueManager,
    managed: boolean,
  ) {
    super(managed);
    this.queueManager = queueManager;
    this.messageManager = messageManager;
    this.redisClient = redisClient;
  }

  protected addQueue = (
    queue: TQueueParams,
    settings: TQueueSettings,
  ): TWebsocketMainStreamPayloadQueue => {
    const { ns, name } = queue;
    const { priorityQueuing, rateLimit, type } = settings;
    if (!this.data.queues[ns]) {
      this.data.queues[ns] = {};
    }
    if (!this.data.queues[ns][name]) {
      this.data.queuesCount += 1;
      this.data.queues[ns][name] = {
        name,
        ns,
        priorityQueuing,
        type,
        rateLimit: rateLimit ?? null,
        deadLetteredMessagesCount: 0,
        acknowledgedMessagesCount: 0,
        pendingMessagesCount: 0,
        consumersCount: 0,
      };
    }
    return this.data.queues[ns][name];
  };

  protected getQueueSize = (
    queues: TQueueParams[],
    cb: ICallback<void>,
  ): void => {
    async.each(
      queues,
      (queueParams, _, done) => {
        async.waterfall(
          [
            (cb: ICallback<TWebsocketMainStreamPayloadQueue>) => {
              this.queueManager.queue.getSettings(
                queueParams,
                (err, settings) => {
                  if (err) done(err);
                  else if (!settings) cb(new errors.EmptyCallbackReplyError());
                  else {
                    const queue = this.addQueue(queueParams, settings);
                    cb(null, queue);
                  }
                },
              );
            },
            (
              queue: TWebsocketMainStreamPayloadQueue,
              cb: ICallback<TWebsocketMainStreamPayloadQueue>,
            ) => {
              this.messageManager.pendingMessages.count(
                queueParams,
                (err, count) => {
                  if (err) cb(err);
                  else {
                    queue.pendingMessagesCount = Number(count);
                    this.data.pendingMessagesCount +=
                      queue.pendingMessagesCount;
                    cb(null, queue);
                  }
                },
              );
            },
            (
              queue: TWebsocketMainStreamPayloadQueue,
              cb: ICallback<TWebsocketMainStreamPayloadQueue>,
            ) => {
              this.messageManager.deadLetteredMessages.count(
                queueParams,
                (err, count) => {
                  if (err) cb(err);
                  else {
                    queue.deadLetteredMessagesCount = Number(count);
                    this.data.deadLetteredMessagesCount +=
                      queue.deadLetteredMessagesCount;
                    cb(null, queue);
                  }
                },
              );
            },
            (queue: TWebsocketMainStreamPayloadQueue, cb: ICallback<void>) => {
              this.messageManager.acknowledgedMessages.count(
                queueParams,
                (err, count) => {
                  if (err) cb(err);
                  else {
                    queue.acknowledgedMessagesCount = Number(count);
                    this.data.acknowledgedMessagesCount +=
                      queue.acknowledgedMessagesCount;
                    cb();
                  }
                },
              );
            },
          ],
          done,
        );
      },
      cb,
    );
  };

  protected getQueues = (cb: ICallback<TQueueParams[]>): void => {
    this.queueManager.queue.list(cb);
  };

  protected countScheduledMessages = (cb: ICallback<void>): void => {
    this.messageManager.scheduledMessages.count((err, count) => {
      if (err) cb(err);
      else {
        this.data.scheduledMessagesCount = count ?? 0;
        cb();
      }
    });
  };

  protected countQueueConsumers = (
    queue: TQueueParams,
    cb: ICallback<void>,
  ): void => {
    Consumer.countOnlineConsumers(this.redisClient, queue, (err, reply) => {
      if (err) cb(err);
      else {
        const { ns, name } = queue;
        const count = Number(reply);
        this.data.consumersCount += count;
        this.data.queues[ns][name].consumersCount = count;
        cb();
      }
    });
  };

  protected updateOnlineInstances = (cb: ICallback<void>): void => {
    async.each(
      this.data.queues,
      (item, key, done) => {
        async.each(
          item,
          (item, key, done) => {
            this.countQueueConsumers(item, done);
          },
          done,
        );
      },
      cb,
    );
  };

  protected publish = (cb: ICallback<void>): void => {
    this.redisClient.publish('streamMain', JSON.stringify(this.data), () =>
      cb(),
    );
  };

  protected reset = (): void => {
    this.data = {
      scheduledMessagesCount: 0,
      deadLetteredMessagesCount: 0,
      pendingMessagesCount: 0,
      acknowledgedMessagesCount: 0,
      consumersCount: 0,
      queuesCount: 0,
      queues: {},
    };
  };

  work = (cb: ICallback<void>): void => {
    this.reset();
    async.waterfall(
      [
        this.countScheduledMessages,
        this.getQueues,
        this.getQueueSize,
        this.updateOnlineInstances,
      ],
      (err) => {
        if (err) cb(err);
        else {
          this.publish(cb);
        }
      },
    );
  };
}

export default WebsocketMainStreamWorker;
