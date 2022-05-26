import { validateTime } from '../../common/common';
import { createQueue } from '../../common/message-producing';
import { listenForWebsocketStreamEvents } from '../../common/websocket-event';
import { getConsumer } from '../../common/consumers';
import { startWebsocketHeartbeatStreamWorker } from '../../common/websocket-heartbeat-stream-worker';
import { TConsumerHeartbeat } from 'redis-smq/dist/types';
import { defaultQueue } from '../../common/common';

test('WebsocketHeartbeatStreamWorker: streamConsumerHeartbeat', async () => {
  await createQueue(defaultQueue, false);
  const consumer = getConsumer();
  await consumer.runAsync();

  const data = await listenForWebsocketStreamEvents<TConsumerHeartbeat>(
    `streamConsumerHeartbeat:${consumer.getId()}`,
    startWebsocketHeartbeatStreamWorker,
  );
  for (let i = 0; i < data.length; i += 1) {
    const diff = data[i].ts - data[0].ts;
    expect(validateTime(diff, 1000 * i)).toBe(true);
    expect(Object.keys(data[i].payload)).toEqual(
      expect.arrayContaining(['timestamp', 'data']),
    );
    expect(Object.keys(data[i].payload.data)).toEqual(
      expect.arrayContaining(['ram', 'cpu']),
    );
  }
});
