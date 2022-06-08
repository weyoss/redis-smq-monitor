import { promisifyAll } from 'bluebird';
import { IProducerMessageRateFields } from '../../../types';
import { ProducerMessageRateWriter } from '../../../src/event-listeners/message-rate/producer/producer-message-rate-writer';
import { ProducerMessageRate } from '../../../src/event-listeners/message-rate/producer/producer-message-rate';
import { getRedisInstance } from '../../common/redis-clients';

test('ProducerMessageRate/ProducerMessageRateWriter: case 1', async () => {
  const redisClient = await getRedisInstance();
  const messageRateWriter = promisifyAll(
    new ProducerMessageRateWriter(redisClient),
  );
  const messageRate = promisifyAll(new ProducerMessageRate(messageRateWriter));

  const r = await new Promise<{
    ts: number;
    rateFields: IProducerMessageRateFields;
  }>((resolve) => {
    const orig = messageRateWriter.onUpdate;
    messageRateWriter.onUpdate = function (ts, rateFields, cb) {
      orig.call(this, ts, rateFields, (err) => {
        cb(err);
        messageRateWriter.onUpdate = orig;
        resolve({ ts, rateFields });
      });
    };
  });
  expect(typeof r.ts).toBe('number');
  expect(typeof r.rateFields.publishedRate).toBe('number');
  expect(r.rateFields.queuePublishedRate).toEqual({});

  messageRate.incrementPublished({ ns: 'testing', name: 'test_queue' });
  const r2 = await new Promise<{
    ts: number;
    rateFields: IProducerMessageRateFields;
  }>((resolve) => {
    const orig = messageRateWriter.onUpdate;
    messageRateWriter.onUpdate = function (ts, rateFields, cb) {
      orig.call(this, ts, rateFields, (err) => {
        cb(err);
        messageRateWriter.onUpdate = orig;
        resolve({ ts, rateFields });
      });
    };
  });
  expect(typeof r2.ts).toBe('number');
  expect(typeof r2.rateFields.publishedRate).toBe('number');
  expect(typeof r2.rateFields.queuePublishedRate[`testing:test_queue`]).toEqual(
    'number',
  );

  await messageRate.quitAsync();
});
