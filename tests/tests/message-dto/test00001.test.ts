import { MessageDTO } from '../../../src/common/dto/queues/message.DTO';
import { ValidationError } from 'class-validator';
import { validateDTO } from '../../../src/common/validate-dto';

test('Message DTO: queue', async () => {
  const msg: Record<string, any> = {
    body: 'some data',
    scheduledCron: null,
    scheduledDelay: null,
    scheduledRepeatPeriod: null,
    priority: null,
    queue: {
      name: 'queue_1663609095187',
      ns: 'default',
    },
    messageState: {
      publishedAt: 1663609095245,
      scheduledAt: null,
      uuid: '86c00b3a-0fbc-48ab-bbaa-ba45ded62d79',
      scheduledCronFired: false,
      attempts: 0,
      scheduledRepeatCount: 0,
      expired: false,
      nextScheduledDelay: 0,
      nextRetryDelay: 0,
    },
    exchange: {
      destinationQueue: {
        name: 'queue_1663609095187',
        ns: 'default',
      },
      exchangeTag: 'DirectExchange-0dfa0e42-69a0-4146-b8f7-6fe6382ef177',
      bindingParams: 'queue_1663609095187',
      type: 0,
    },
    createdAt: 1663609095245,
    ttl: 0,
    retryThreshold: 3,
    retryDelay: 60000,
    consumeTimeout: 0,
    scheduledRepeat: 0,
  };
  await validateDTO(MessageDTO, msg);

  // type-coverage:ignore-next-line
  msg.queue = 123;
  await expect(async () => validateDTO(MessageDTO, msg)).rejects.toBeInstanceOf(
    ValidationError,
  );

  // type-coverage:ignore-next-line
  msg.queue = true;
  await expect(async () => validateDTO(MessageDTO, msg)).rejects.toBeInstanceOf(
    ValidationError,
  );

  // type-coverage:ignore-next-line
  msg.queue = null;
  await validateDTO(MessageDTO, msg);

  // type-coverage:ignore-next-line
  msg.queue = {
    ns: 'ns1',
    name: 'queue1',
  };
  await validateDTO(MessageDTO, msg);

  // type-coverage:ignore-next-line
  msg.queue = {
    ns: 'ns1',
    q: 'queue1',
  };
  await expect(async () => validateDTO(MessageDTO, msg)).rejects.toBeInstanceOf(
    ValidationError,
  );
});
