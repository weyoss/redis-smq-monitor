import { promisifyAll } from 'bluebird';
import { IProducerMessageRateFields } from '../../../types';
import { ProducerMessageRateWriter } from '../../../src/event-listeners/message-rate/producer/producer-message-rate-writer';
import { ProducerMessageRate } from '../../../src/event-listeners/message-rate/producer/producer-message-rate';
import { getRedisInstance } from '../../common/redis-clients';

test('ProducerMessageRate/ProducerMessageRateWriter: case 2', async () => {
  const redisClient = await getRedisInstance();
  const messageRateWriter = new ProducerMessageRateWriter(redisClient);
  const messageRate = promisifyAll(new ProducerMessageRate(messageRateWriter));

  const rateFields1 = await new Promise<{
    ts: number;
    rateFields: IProducerMessageRateFields;
  }>((resolve) => {
    const orig = messageRateWriter.onRateTick;
    messageRateWriter.onRateTick = (ts, rateFields) => {
      messageRateWriter.onRateTick = orig;
      resolve({ ts, rateFields });
    };
  });
  expect(typeof rateFields1.ts).toBe('number');
  expect(typeof rateFields1.rateFields.publishedRate).toBe('number');
  expect(rateFields1.rateFields.queuePublishedRate).toEqual({});

  messageRate.incrementPublished({ ns: 'testing', name: 'queue_1' });
  const rateFields2 = await new Promise<{
    ts: number;
    rateFields: IProducerMessageRateFields;
  }>((resolve) => {
    const orig = messageRateWriter.onRateTick;
    messageRateWriter.onRateTick = (ts, rateFields) => {
      messageRateWriter.onRateTick = orig;
      resolve({ ts, rateFields });
    };
  });
  expect(typeof rateFields2.ts).toBe('number');
  expect(typeof rateFields2.rateFields.publishedRate).toBe('number');
  expect(
    typeof rateFields2.rateFields.queuePublishedRate[`testing:queue_1`],
  ).toEqual('number');

  await messageRate.quitAsync();
});
