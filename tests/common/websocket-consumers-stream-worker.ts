import WebsocketConsumersStreamWorker from '../../src/workers/websocket-consumers-stream.worker';
import { getRedisInstance } from './redis-clients';
import { getQueueManager } from './queue-manager';

let websocketConsumersStreamWorker: WebsocketConsumersStreamWorker | null =
  null;

export async function startWebsocketConsumersStreamWorker(): Promise<void> {
  if (!websocketConsumersStreamWorker) {
    const redisClient = await getRedisInstance();
    const queueManager = await getQueueManager();
    websocketConsumersStreamWorker = new WebsocketConsumersStreamWorker(
      redisClient,
      queueManager,
      false,
    );
    websocketConsumersStreamWorker.run();
  }
}

export async function stopWebsocketConsumersStreamWorker(): Promise<void> {
  return new Promise<void>((resolve) => {
    if (websocketConsumersStreamWorker) {
      websocketConsumersStreamWorker.quit(() => {
        websocketConsumersStreamWorker = null;
        resolve();
      });
    } else resolve();
  });
}
