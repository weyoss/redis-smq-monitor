import { TimeSeries } from './time-series';
import { TTimeSeriesParams, TTimeSeriesRange } from '../../../../types';
import { ICallback, TRedisClientMulti } from 'redis-smq-common/dist/types';
import { errors } from 'redis-smq-common';

export class SortedSetTimeSeries extends TimeSeries<TTimeSeriesParams> {
  add(
    ts: number,
    value: number,
    mixed: ICallback<void> | TRedisClientMulti,
  ): void {
    const process = (multi: TRedisClientMulti) => {
      multi.zadd(this.key, ts, `${value}:${ts}`);
      this.expireAfter && multi.expire(this.key, this.expireAfter);
    };
    if (typeof mixed === 'function') {
      const multi = this.redisClient.multi();
      process(multi);
      this.redisClient.execMulti(multi, (err) => mixed(err));
    } else process(mixed);
  }

  cleanUp(cb: ICallback<void>): void {
    const ts = TimeSeries.getCurrentTimestamp();
    const max = ts - this.retentionTime;
    this.redisClient.zremrangebyscore(this.key, '-inf', `${max}`, (err) =>
      cb(err),
    );
  }

  getRange(from: number, to: number, cb: ICallback<TTimeSeriesRange>): void {
    if (to <= from) {
      cb(
        new errors.ArgumentError(
          `Expected parameter [to] to be greater than [from]`,
        ),
      );
    } else {
      this.redisClient.zrangebyscorewithscores(
        this.key,
        to,
        from,
        (err, reply) => {
          if (err) cb(err);
          else {
            const replyRange = reply ?? {};
            const length = to - from;
            const range = new Array(length)
              .fill(0)
              .map((_: number, index: number) => {
                const timestamp = from + index;
                const value =
                  typeof replyRange[timestamp] === 'string'
                    ? Number(replyRange[timestamp].split(':')[0])
                    : 0;
                return {
                  timestamp,
                  value,
                };
              });
            cb(null, range);
          }
        },
      );
    }
  }
}
