import { validateTimeSeriesFrom } from '../../common/websocket-event';

test('Queue acknowledged time series', async () => {
  await validateTimeSeriesFrom(
    `/api/ns/testing/queues/test_queue/time-series/acknowledged`,
  );
});
