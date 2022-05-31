import { promisifyAll } from 'bluebird';
import { getRedisInstance } from '../../common/redis-clients';
import { HashTimeSeries } from '../../../src/plugins/message-rate/common/hash-time-series';
import { TimeSeries } from '../../../src/plugins/message-rate/common/time-series';

test('HashTimeSeries: Case 1', async () => {
  const redisClient = await getRedisInstance();
  const hashTimeSeries = promisifyAll(
    new HashTimeSeries(redisClient, {
      key: 'my-key',
      indexKey: 'my-key-index',
      expireAfterInSeconds: 20,
    }),
  );
  const multi = promisifyAll(redisClient.multi());
  const ts = TimeSeries.getCurrentTimestamp();
  hashTimeSeries.add(ts, 100, multi);
  hashTimeSeries.add(ts + 3, 56, multi);
  hashTimeSeries.add(ts + 10, 70, multi);
  await multi.execAsync();
  const range = await hashTimeSeries.getRangeAsync(ts - 20, ts + 20);

  expect(range.length).toBe(40);
  expect(range[0]).toEqual({ timestamp: ts - 20, value: 0 });
  expect(range[20]).toEqual({ timestamp: ts, value: 100 });
  expect(range[23]).toEqual({ timestamp: ts + 3, value: 56 });
  expect(range[30]).toEqual({ timestamp: ts + 10, value: 70 });
  expect(range[39]).toEqual({ timestamp: ts + 20 - 1, value: 0 });
});
