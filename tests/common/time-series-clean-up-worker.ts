import TimeSeriesCleanUpWorker from '../../src/workers/time-series.clean-up.worker';
import { getRedisInstance } from './redis-clients';
import { getQueueManager } from './queue-manager';

let timeSeriesCleanUpWorker: TimeSeriesCleanUpWorker | null = null;

export async function startTimeSeriesWorker(): Promise<void> {
  if (!timeSeriesCleanUpWorker) {
    const redisClient = await getRedisInstance();
    const queueManager = await getQueueManager();
    timeSeriesCleanUpWorker = new TimeSeriesCleanUpWorker(
      redisClient,
      queueManager,
      false,
    );
    timeSeriesCleanUpWorker.run();
  }
}

export async function stopTimeSeriesWorker(): Promise<void> {
  return new Promise<void>((resolve) => {
    if (timeSeriesCleanUpWorker) {
      timeSeriesCleanUpWorker.quit(() => {
        timeSeriesCleanUpWorker = null;
        resolve();
      });
    } else resolve();
  });
}
