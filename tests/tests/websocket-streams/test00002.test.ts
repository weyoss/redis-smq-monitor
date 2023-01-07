import { startWebsocketMainStreamWorker } from '../../common/websocket-main-stream-worker';
import { getRedisInstance } from '../../common/redis-clients';
import { TWebsocketMainStreamPayload } from '../../../types';
import { createQueue } from '../../common/message-producing';
import { getConsumer } from '../../common/consumers';
import { defaultQueue } from '../../common/common';
import { EQueueType } from 'redis-smq/dist/types';

test('WebsocketMainStreamWorker: Case 2', async () => {
  await createQueue(defaultQueue, false);
  const consumer = getConsumer();
  await consumer.runAsync();

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
    consumersCount: 1,
    queuesCount: 1,
    queues: {
      testing: {
        test_queue: {
          name: 'test_queue',
          ns: 'testing',
          priorityQueuing: false,
          type: EQueueType.LIFO_QUEUE,
          rateLimit: null,
          deadLetteredMessagesCount: 0,
          acknowledgedMessagesCount: 0,
          pendingMessagesCount: 0,
          consumersCount: 1,
        },
      },
    },
  });
});
