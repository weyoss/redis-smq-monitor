import WebsocketHeartbeatStreamWorker from '../../src/workers/websocket-heartbeat-stream.worker';
import { getRedisInstance } from './redis-clients';

let websocketHeartbeatStreamWorker: WebsocketHeartbeatStreamWorker | null =
  null;

export async function startWebsocketHeartbeatStreamWorker(): Promise<void> {
  if (!websocketHeartbeatStreamWorker) {
    const redisClient = await getRedisInstance();
    websocketHeartbeatStreamWorker = new WebsocketHeartbeatStreamWorker(
      redisClient,
      false,
    );
    websocketHeartbeatStreamWorker.run();
  }
}

export async function stopWebsocketHeartbeatStreamWorker(): Promise<void> {
  return new Promise<void>((resolve) => {
    if (websocketHeartbeatStreamWorker) {
      websocketHeartbeatStreamWorker.quit(() => {
        websocketHeartbeatStreamWorker = null;
        resolve();
      });
    } else resolve();
  });
}
