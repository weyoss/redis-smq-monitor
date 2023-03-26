import { validateTime } from '../../common/common';
import { createQueue } from '../../common/message-producing';
import { listenForWebsocketStreamEvents } from '../../common/websocket-event';
import { getConsumer } from '../../common/consumers';
import { startWebsocketConsumersStreamWorker } from '../../common/websocket-consumers-stream-worker';
import { TConsumerInfo } from 'redis-smq/dist/types';
import { defaultQueue } from '../../common/common';

test('WebsocketQueueConsumersStreamWorker: streamQueueConsumers/case 1', async () => {
  await createQueue(defaultQueue, false);
  const consumer = getConsumer();
  await consumer.runAsync();

  const data = await listenForWebsocketStreamEvents<Record<string, string>>(
    `streamQueueConsumers:${defaultQueue.ns}:${defaultQueue.name}`,
    startWebsocketConsumersStreamWorker,
  );
  for (let i = 0; i < data.length; i += 1) {
    const diff = data[i].ts - data[0].ts;
    expect(validateTime(diff, 1000 * i)).toBe(true);
    expect(Object.keys(data[i].payload)).toEqual([consumer.getId()]);
    const payload: TConsumerInfo = JSON.parse(
      data[i].payload[consumer.getId()],
    );
    expect(Object.keys(payload)).toEqual([
      'ipAddress',
      'hostname',
      'pid',
      'createdAt',
    ]);
  }
});
