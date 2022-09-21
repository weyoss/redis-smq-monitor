import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { TQueueParams } from 'redis-smq/dist/types';

@ValidatorConstraint({ name: 'message-topic-exchange-validator', async: false })
export class MessageTopicExchangeValidator
  implements ValidatorConstraintInterface
{
  validate(
    mixed: unknown | TQueueParams | string,
    args: ValidationArguments,
  ): boolean {
    if (mixed) {
      if (typeof mixed === 'string') return true;
      if (typeof mixed === 'object' && mixed.constructor === Object) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { ns, topic } = mixed;
        return (
          !!ns && typeof ns === 'string' && !!topic && typeof topic === 'string'
        );
      }
    }
    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    return `(${args.property}) must be either a string or an object describing the namespace and the topic of the exchange`;
  }
}
