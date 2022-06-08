import { MessageRateWriter } from '../common/message-rate-writer';
import { GlobalPublishedTimeSeries } from './global-published-time-series';
import { QueuePublishedTimeSeries } from './queue-published-time-series';
import { IProducerMessageRateFields } from '../../../../types';
import { RedisClient } from 'redis-smq-common';
import { ICallback } from 'redis-smq-common/dist/types';

export class ProducerMessageRateWriter extends MessageRateWriter<IProducerMessageRateFields> {
  protected redisClient: RedisClient;
  protected globalPublishedTimeSeries: ReturnType<
    typeof GlobalPublishedTimeSeries
  >;
  protected queuePublishedTimeSeries: Record<
    string,
    ReturnType<typeof QueuePublishedTimeSeries>
  > = {};

  constructor(redisClient: RedisClient) {
    super();
    this.redisClient = redisClient;
    this.globalPublishedTimeSeries = GlobalPublishedTimeSeries(redisClient);
  }

  onUpdate(
    ts: number,
    rates: IProducerMessageRateFields,
    cb: ICallback<void>,
  ): void {
    const { publishedRate, queuePublishedRate } = rates;
    if (Object.keys(queuePublishedRate).length) {
      if (publishedRate) {
        const multi = this.redisClient.multi();
        this.globalPublishedTimeSeries.add(ts, publishedRate, multi);
        for (const key in queuePublishedRate) {
          const value = queuePublishedRate[key];
          if (value) {
            if (!this.queuePublishedTimeSeries[key]) {
              const [ns, name] = key.split(':');
              this.queuePublishedTimeSeries[key] = QueuePublishedTimeSeries(
                this.redisClient,
                { ns, name },
              );
            }
            this.queuePublishedTimeSeries[key].add(ts, value, multi);
          }
        }
        multi.exec(() => cb());
      } else cb();
    } else cb();
  }
}
