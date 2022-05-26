import { TWebsocketHeartbeatOnlineIdsStreamPayload } from '../../types';
import { ICallback } from 'redis-smq-common/dist/types';
import { async, RedisClient, Worker } from 'redis-smq-common';
import { Consumer } from 'redis-smq';

export class WebsocketHeartbeatStreamWorker extends Worker {
  protected redisClient: RedisClient;

  constructor(redisClient: RedisClient, managed: boolean) {
    super(managed);
    this.redisClient = redisClient;
  }

  work = (cb: ICallback<void>): void => {
    const onlineIds: TWebsocketHeartbeatOnlineIdsStreamPayload = {
      consumers: [],
    };
    Consumer.getConsumerHeartbeats(this.redisClient, (err, reply) => {
      if (err) cb(err);
      else {
        async.each(
          reply ?? [],
          (item, _, done) => {
            onlineIds.consumers.push(item.consumerId);
            this.redisClient.publish(
              `streamConsumerHeartbeat:${item.consumerId}`,
              item.payload,
              () => done(),
            );
          },
          () => {
            this.redisClient.publish(
              `streamHeartbeatOnlineIds`,
              JSON.stringify(onlineIds),
              () => cb(),
            );
          },
        );
      }
    });
  };
}

export default WebsocketHeartbeatStreamWorker;
