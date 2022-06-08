import { EventEmitter } from 'events';
import { MessageRateWriter } from './message-rate-writer';
import { TimeSeries } from './time-series';
import { TMessageRateFields } from '../../../../types';
import { async, Ticker } from 'redis-smq-common';
import { ICallback } from 'redis-smq-common/dist/types';
import { events } from 'redis-smq';

export abstract class MessageRate<
  MessageRateFields extends TMessageRateFields = TMessageRateFields,
> extends EventEmitter {
  protected readerTicker: Ticker;
  protected messageRateWriter: MessageRateWriter<MessageRateFields>;

  constructor(messageRateWriter: MessageRateWriter<MessageRateFields>) {
    super();
    this.readerTicker = new Ticker(this.onTick);
    this.readerTicker.runTimer();
    this.messageRateWriter = messageRateWriter;
  }

  protected onTick = (): void => {
    const ts = TimeSeries.getCurrentTimestamp();
    const rates = this.getRateFields();
    this.messageRateWriter.onRateTick(ts, rates);
  };

  quit(cb: ICallback<void>): void {
    async.waterfall(
      [
        (cb: ICallback<void>) => {
          this.readerTicker.once(events.DOWN, cb);
          this.readerTicker.quit();
        },
        (cb: ICallback<void>) => this.messageRateWriter.quit(cb),
      ],
      cb,
    );
  }

  abstract getRateFields(): MessageRateFields;
}
