import { createQueue } from '../../../common/message-producing';
import { getConsumer } from '../../../common/consumers';
import { validateTimeSeriesFrom } from '../../../common/websocket-event';
import { defaultQueue } from '../../../common/common';

test('Consumer acknowledged time series', async () => {
  await createQueue(defaultQueue, false);
  const consumer = getConsumer();
  await consumer.runAsync();
  await validateTimeSeriesFrom(
    `/api/consumers/${consumer.getId()}/time-series/acknowledged`,
  );
});
