import { validateTimeSeriesFrom } from '../../common/websocket-event';

test('Global published time series', async () => {
  await validateTimeSeriesFrom(`/api/main/time-series/published`);
});
