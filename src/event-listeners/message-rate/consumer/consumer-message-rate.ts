import { MessageRate } from '../common/message-rate';
import { IConsumerMessageRateFields } from '../../../../types';

export class ConsumerMessageRate extends MessageRate<IConsumerMessageRateFields> {
  protected acknowledgedRate = 0;
  protected deadLetteredRate = 0;

  getRateFields(): IConsumerMessageRateFields {
    const acknowledgedRate = this.acknowledgedRate;
    const deadLetteredRate = this.deadLetteredRate;
    this.acknowledgedRate = 0;
    this.deadLetteredRate = 0;
    return {
      acknowledgedRate,
      deadLetteredRate,
    };
  }

  incrementAcknowledged(): void {
    this.acknowledgedRate += 1;
  }

  incrementDeadLettered(): void {
    this.deadLetteredRate += 1;
  }
}
