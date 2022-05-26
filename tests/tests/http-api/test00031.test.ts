import { validateTimeSeriesFrom } from '../../common/websocket-event';

test('Global acknowledged time series', async () => {
  await validateTimeSeriesFrom(`/api/main/time-series/acknowledged`);
});
