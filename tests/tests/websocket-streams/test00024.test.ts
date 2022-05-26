import { validateTime } from '../../common/common';
import { createQueue } from '../../common/message-producing';
import { listenForWebsocketStreamEvents } from '../../common/websocket-event';
import { getConsumer } from '../../common/consumers';
import { TWebsocketHeartbeatOnlineIdsStreamPayload } from '../../../types';
import { startWebsocketHeartbeatStreamWorker } from '../../common/websocket-heartbeat-stream-worker';
import { defaultQueue } from '../../common/common';

test('WebsocketHeartbeatStreamWorker: streamHeartbeatOnlineIds', async () => {
  await createQueue(defaultQueue, false);
  const consumer = getConsumer();
  await consumer.runAsync();

  const data =
    await listenForWebsocketStreamEvents<TWebsocketHeartbeatOnlineIdsStreamPayload>(
      `streamHeartbeatOnlineIds`,
      startWebsocketHeartbeatStreamWorker,
    );
  for (let i = 0; i < data.length; i += 1) {
    const diff = data[i].ts - data[0].ts;
    expect(validateTime(diff, 1000 * i)).toBe(true);
    expect(data[i].payload).toEqual({
      consumers: [consumer.getId()],
    });
  }
});
