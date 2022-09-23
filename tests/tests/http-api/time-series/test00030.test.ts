import { validateTimeSeriesFrom } from '../../../common/websocket-event';

test('Global dead-lettered time series', async () => {
  await validateTimeSeriesFrom(`/api/main/time-series/dead-lettered`);
});
