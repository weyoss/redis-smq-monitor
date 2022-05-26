import { QueueManager } from 'redis-smq';
import { TConfig } from '../../types';
import { promisifyAll } from 'bluebird';

const QueueManagerAsync = promisifyAll(QueueManager);
let queueManager: QueueManager | null = null;

export async function getQueueManagerInstance(config: TConfig) {
  if (!queueManager) {
    queueManager = await QueueManagerAsync.createInstanceAsync(config);
  }
  return queueManager;
}

export async function destroyQueueManager() {
  if (queueManager) {
    await promisifyAll(queueManager).quitAsync();
    queueManager = null;
  }
}
