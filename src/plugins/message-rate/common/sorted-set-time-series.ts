import { TimeSeries } from './time-series';
import { TTimeSeriesParams, TTimeSeriesRange } from '../../../../types';
import { ICallback, IRedisClientMulti } from 'redis-smq-common/dist/types';
import { errors } from 'redis-smq-common';

export class SortedSetTimeSeries extends TimeSeries<TTimeSeriesParams> {
  add(
    ts: number,
    value: number,
    mixed: ICallback<void> | IRedisClientMulti,
  ): void {
    const process = (multi: IRedisClientMulti) => {
      multi.zadd(this.key, ts, `${value}:${ts}`);
      this.expireAfter && multi.pexpire(this.key, this.expireAfter * 1000);
    };
    if (typeof mixed === 'function') {
      const multi = this.redisClient.multi();
      process(multi);
      multi.exec((err) => mixed(err));
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
        from,
        to,
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
