import { shutdownMessageManager } from './message-manager';
import { shutdownQueueManager } from './queue-manager';
import { shutdownRedisClients } from './redis-clients';
import { shutdownConsumers } from './consumers';
import { shutdownProducers } from './producers';
import { stopMonitorServer } from './monitor-server';
import { stopTimeSeriesWorker } from './time-series-clean-up-worker';
import { stopWebsocketMainStreamWorker } from './websocket-main-stream-worker';
import { stopWebsocketConsumersStreamWorker } from './websocket-consumers-stream-worker';
import { stopWebsocketRateStreamWorker } from './websocket-rate-stream-worker';

export async function shutDown(): Promise<void> {
  await stopMonitorServer();
  await stopTimeSeriesWorker();
  await stopWebsocketMainStreamWorker();
  await stopWebsocketConsumersStreamWorker();
  await stopWebsocketRateStreamWorker();
  await shutdownConsumers();
  await shutdownProducers();
  await shutdownMessageManager();
  await shutdownQueueManager();

  // Redis clients should be stopped in the last step, to avoid random errors from different
  // dependant components.
  await shutdownRedisClients();
}
