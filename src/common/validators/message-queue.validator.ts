import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'message-queue-validator', async: false })
export class MessageQueueValidator implements ValidatorConstraintInterface {
  validate(mixed: unknown, args: ValidationArguments): boolean {
    if (mixed) {
      if (typeof mixed === 'string') return true;
      if (typeof mixed === 'object' && mixed.constructor === Object) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { ns, name } = mixed;
        return (
          !!ns && typeof ns === 'string' && !!name && typeof name === 'string'
        );
      }
    }
    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    return `(${args.property}) must be either a string or an object describing the namespace and the name of the queue`;
  }
}
