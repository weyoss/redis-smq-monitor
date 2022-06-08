import { promisifyAll } from 'bluebird';
import { getRedisInstance } from '../../common/redis-clients';
import { HashTimeSeries } from '../../../src/event-listeners/message-rate/common/hash-time-series';
import { TimeSeries } from '../../../src/event-listeners/message-rate/common/time-series';

test('HashTimeSeries: Case 3', async () => {
  const redisClient = await getRedisInstance();
  const hashTimeSeries = promisifyAll(
    new HashTimeSeries(redisClient, {
      key: 'my-key',
      indexKey: 'my-key-index',
      retentionTimeInSeconds: 5,
    }),
  );
  const ts = TimeSeries.getCurrentTimestamp();
  for (let i = 0; i < 10; i += 1) {
    await hashTimeSeries.addAsync(ts + i, i);
  }
  await hashTimeSeries.addAsync(ts + 5, 100);
  await hashTimeSeries.addAsync(ts + 1, 70);

  const range1 = await hashTimeSeries.getRangeAsync(ts, ts + 10);
  expect(range1[0]).toEqual({ timestamp: ts, value: 0 });
  expect(range1[1]).toEqual({ timestamp: ts + 1, value: 71 });
  expect(range1[5]).toEqual({ timestamp: ts + 5, value: 105 });
  expect(range1[9]).toEqual({ timestamp: ts + 9, value: 9 });
});
