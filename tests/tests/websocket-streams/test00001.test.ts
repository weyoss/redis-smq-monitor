import { TWebsocketMainStreamPayload } from '../../../types';
import { startWebsocketMainStreamWorker } from '../../common/websocket-main-stream-worker';
import { getRedisInstance } from '../../common/redis-clients';

test('WebsocketMainStreamWorker: Case 1', async () => {
  await startWebsocketMainStreamWorker();

  const subscribeClient = await getRedisInstance();
  subscribeClient.subscribe('streamMain');

  const json = await new Promise<TWebsocketMainStreamPayload>((resolve) => {
    subscribeClient.on('message', (channel: string, message: string) => {
      const json: TWebsocketMainStreamPayload = JSON.parse(message);
      resolve(json);
    });
  });

  expect(json).toEqual({
    scheduledMessagesCount: 0,
    deadLetteredMessagesCount: 0,
    pendingMessagesCount: 0,
    acknowledgedMessagesCount: 0,
    consumersCount: 0,
    queuesCount: 0,
    queues: {},
  });
});
