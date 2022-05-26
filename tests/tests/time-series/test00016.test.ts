import { delay } from 'bluebird';
import { getQueueManagerAsync } from '../../common/queue-manager';
import { startTimeSeriesWorker } from '../../common/time-series-clean-up-worker';
import { defaultQueue } from '../../common/common';
import { getConsumer } from '../../common/consumers';

test('TimeSeriesWorker', async () => {
  await startTimeSeriesWorker();
  await delay(5000);
  const queueManager = await getQueueManagerAsync();
  queueManager.queue.createAsync(defaultQueue, false);
  await delay(5000);
  const consumer = await getConsumer({ queue: defaultQueue });
  await consumer.runAsync();
  await delay(5000);
});
