import { validateTime } from '../../common/common';
import { ITimeSeriesRangeItem } from '../../../types';
import {
  createQueue,
  produceAndAcknowledgeMessage,
} from '../../common/message-producing';
import { listenForWebsocketStreamEvents } from '../../common/websocket-event';
import { defaultQueue } from '../../common/common';

test('WebsocketRateStreamWorker: streamGlobalAcknowledged', async () => {
  await createQueue(defaultQueue, false);
  await produceAndAcknowledgeMessage();

  const data = await listenForWebsocketStreamEvents(`streamGlobalAcknowledged`);

  const values: ITimeSeriesRangeItem[] = [];
  for (let i = 0; i < data.length; i += 1) {
    const diff = data[i].ts - data[0].ts;
    expect(validateTime(diff, 1000 * i)).toBe(true);
    expect(data[i].payload.length).toBe(60);
    const a = data[i].payload.find((i) => i.value !== 0);
    if (a) values.push(a);
  }
  expect(values.length > 0).toBe(true);
});
