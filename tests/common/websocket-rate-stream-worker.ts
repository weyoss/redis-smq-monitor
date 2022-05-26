import WebsocketRateStreamWorker from '../../src/workers/websocket-rate-stream.worker';
import { getRedisInstance } from './redis-clients';
import { getQueueManager } from './queue-manager';

let websocketRateStreamWorker: WebsocketRateStreamWorker | null = null;

export async function startWebsocketRateStreamWorker(): Promise<void> {
  if (!websocketRateStreamWorker) {
    const redisClient = await getRedisInstance();
    const queueManager = await getQueueManager();
    websocketRateStreamWorker = new WebsocketRateStreamWorker(
      redisClient,
      queueManager,
      false,
    );
    websocketRateStreamWorker.run();
  }
}

export async function stopWebsocketRateStreamWorker(): Promise<void> {
  return new Promise<void>((resolve) => {
    if (websocketRateStreamWorker) {
      websocketRateStreamWorker.quit(() => {
        websocketRateStreamWorker = null;
        resolve();
      });
    } else resolve();
  });
}
