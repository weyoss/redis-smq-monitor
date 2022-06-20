import { config } from './config';
import { TQueueParams } from 'redis-smq/dist/types';
import { QueueManager } from 'redis-smq';
import { ICallback } from 'redis-smq-common/dist/types';

export const queue: TQueueParams = {
  name: 'test_queue',
  ns: 'ns1',
};

export function init(cb: ICallback<void>): void {
  QueueManager.createInstance(config, (err, queueManager) => {
    if (err) cb(err);
    else
      queueManager?.queue.exists(queue, (err, reply) => {
        if (err) cb(err);
        else if (!reply) queueManager?.queue.create(queue, false, cb);
        else cb();
      });
  });
}
