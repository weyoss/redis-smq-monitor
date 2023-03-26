import { validateTime } from '../../common/common';
import { createQueue } from '../../common/message-producing';
import { listenForWebsocketStreamEvents } from '../../common/websocket-event';
import { getConsumer } from '../../common/consumers';
import { TWebsocketQueueOnlineConsumerIdsStreamPayload } from '../../../types';
import { startWebsocketConsumersStreamWorker } from '../../common/websocket-consumers-stream-worker';
import { defaultQueue } from '../../common/common';

test('WebsocketHeartbeatStreamWorker: streamQueueOnlineConsumers', async () => {
  await createQueue(defaultQueue, false);
  const consumer = getConsumer();
  await consumer.runAsync();

  const data =
    await listenForWebsocketStreamEvents<TWebsocketQueueOnlineConsumerIdsStreamPayload>(
      `streamQueueOnlineConsumers:${defaultQueue.ns}:${defaultQueue.name}`,
      startWebsocketConsumersStreamWorker,
    );
  for (let i = 0; i < data.length; i += 1) {
    const diff = data[i].ts - data[0].ts;
    expect(validateTime(diff, 1000 * i)).toBe(true);
    expect(data[i].payload).toEqual({
      ids: [consumer.getId()],
    });
  }
});
