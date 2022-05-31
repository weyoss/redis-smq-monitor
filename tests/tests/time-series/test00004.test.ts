import { delay, promisifyAll } from 'bluebird';
import { getRedisInstance } from '../../common/redis-clients';
import { HashTimeSeries } from '../../../src/plugins/message-rate/common/hash-time-series';
import { TimeSeries } from '../../../src/plugins/message-rate/common/time-series';

test('HashTimeSeries: Case 2', async () => {
  const redisClient = await getRedisInstance();
  const hashTimeSeries = promisifyAll(
    new HashTimeSeries(redisClient, {
      key: 'key-123',
      indexKey: 'key-index-123',
      retentionTimeInSeconds: 5,
      windowSizeInSeconds: 60,
    }),
  );
  const multi = promisifyAll(redisClient.multi());
  const ts = TimeSeries.getCurrentTimestamp();
  for (let i = 0; i < 10; i += 1) {
    hashTimeSeries.add(ts + i, i, multi);
  }
  await multi.execAsync();

  const range1 = await hashTimeSeries.getRangeAsync(ts, ts + 10);

  // extra 5s to exclude js time drift related errors
  await delay(15000);
  await hashTimeSeries.cleanUpAsync();
  const range2 = await hashTimeSeries.getRangeAsync(ts, ts + 10);

  expect(range1.length).toEqual(10);
  expect(range1[0]).toEqual({ timestamp: ts, value: 0 });
  expect(range1[1]).toEqual({ timestamp: ts + 1, value: 1 });
  expect(range1[2]).toEqual({ timestamp: ts + 2, value: 2 });
  expect(range1[3]).toEqual({ timestamp: ts + 3, value: 3 });
  expect(range1[4]).toEqual({ timestamp: ts + 4, value: 4 });
  expect(range1[5]).toEqual({ timestamp: ts + 5, value: 5 });
  expect(range1[6]).toEqual({ timestamp: ts + 6, value: 6 });
  expect(range1[7]).toEqual({ timestamp: ts + 7, value: 7 });
  expect(range1[8]).toEqual({ timestamp: ts + 8, value: 8 });
  expect(range1[9]).toEqual({ timestamp: ts + 9, value: 9 });

  expect(range2.length).toEqual(10);
  expect(range2[0]).toEqual({ timestamp: ts, value: 0 });
  expect(range2[1]).toEqual({ timestamp: ts + 1, value: 0 });
  expect(range2[2]).toEqual({ timestamp: ts + 2, value: 0 });
  expect(range2[3]).toEqual({ timestamp: ts + 3, value: 0 });
  expect(range2[4]).toEqual({ timestamp: ts + 4, value: 0 });
  expect(range2[5]).toEqual({ timestamp: ts + 5, value: 0 });
  expect(range2[6]).toEqual({ timestamp: ts + 6, value: 0 });
  expect(range2[7]).toEqual({ timestamp: ts + 7, value: 0 });
  expect(range2[8]).toEqual({ timestamp: ts + 8, value: 0 });
  expect(range2[9]).toEqual({ timestamp: ts + 9, value: 0 });
});
