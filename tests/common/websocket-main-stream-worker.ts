import WebsocketMainStreamWorker from '../../src/workers/websocket-main-stream.worker';
import { getRedisInstance } from './redis-clients';
import { getMessageManager } from './message-manager';
import { getQueueManager } from './queue-manager';

let websocketMainStreamWorker: WebsocketMainStreamWorker | null = null;

export async function startWebsocketMainStreamWorker(): Promise<void> {
  if (!websocketMainStreamWorker) {
    const redisClient = await getRedisInstance();
    const queueManager = await getQueueManager();
    const messageManager = await getMessageManager();
    websocketMainStreamWorker = new WebsocketMainStreamWorker(
      redisClient,
      messageManager,
      queueManager,
      false,
    );
    websocketMainStreamWorker.run();
  }
}

export async function stopWebsocketMainStreamWorker(): Promise<void> {
  return new Promise<void>((resolve) => {
    if (websocketMainStreamWorker) {
      websocketMainStreamWorker.quit(() => {
        websocketMainStreamWorker = null;
        resolve();
      });
    } else resolve();
  });
}
