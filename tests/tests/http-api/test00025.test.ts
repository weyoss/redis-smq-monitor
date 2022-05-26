import { validateTimeSeriesFrom } from '../../common/websocket-event';

test('Queue dead-lettered time series', async () => {
  await validateTimeSeriesFrom(
    `/api/ns/testing/queues/test_queue/time-series/dead-lettered`,
  );
});
