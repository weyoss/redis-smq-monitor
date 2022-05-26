import { IConfig } from 'redis-smq/dist/types';
import { config } from './config';
import { promisifyAll } from 'bluebird';
import { QueueManager } from 'redis-smq';

const QueueManagerAsync = promisifyAll(QueueManager);

let queueManager: QueueManager | null = null;

export async function getQueueManager(cfg: IConfig = config) {
  if (!queueManager) {
    queueManager = await QueueManagerAsync.createInstanceAsync(cfg);
  }
  return queueManager;
}

export async function getQueueManagerAsync(cfg: IConfig = config) {
  const queueManager = await getQueueManager(cfg);
  const queue = promisifyAll(queueManager.queue);
  const namespace = promisifyAll(queueManager.namespace);
  const queueRateLimit = promisifyAll(queueManager.queueRateLimit);
  const queueMetrics = promisifyAll(queueManager.queueMetrics);
  return {
    queue,
    namespace,
    queueRateLimit,
    queueMetrics,
  };
}

export async function shutdownQueueManager() {
  if (queueManager) {
    const q = promisifyAll(queueManager);
    await q.quitAsync();
    queueManager = null;
  }
}
