import WebsocketOnlineStreamWorker from '../../src/workers/websocket-online-stream.worker';
import { getRedisInstance } from './redis-clients';
import { getQueueManager } from './queue-manager';

let websocketOnlineStreamWorker: WebsocketOnlineStreamWorker | null = null;

export async function startWebsocketOnlineStreamWorker(): Promise<void> {
  if (!websocketOnlineStreamWorker) {
    const redisClient = await getRedisInstance();
    const queueManager = await getQueueManager();
    websocketOnlineStreamWorker = new WebsocketOnlineStreamWorker(
      redisClient,
      queueManager,
      false,
    );
    websocketOnlineStreamWorker.run();
  }
}

export async function stopWebsocketOnlineStreamWorker(): Promise<void> {
  return new Promise<void>((resolve) => {
    if (websocketOnlineStreamWorker) {
      websocketOnlineStreamWorker.quit(() => {
        websocketOnlineStreamWorker = null;
        resolve();
      });
    } else resolve();
  });
}
