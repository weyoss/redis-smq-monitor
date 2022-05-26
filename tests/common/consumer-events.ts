import { Consumer, events, Message } from 'redis-smq';

export async function consumerOnEvent<T extends Array<any>>(
  consumer: Consumer,
  event: string,
) {
  return new Promise<T>((resolve) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    consumer.once(event, (...args: T) => {
      resolve(args);
    });
  });
}

export async function untilMessageAcknowledged(
  consumer: Consumer,
  msg?: Message,
): Promise<void> {
  const [message] = await consumerOnEvent<[Message]>(
    consumer,
    events.MESSAGE_ACKNOWLEDGED,
  );
  if (msg && msg.getRequiredId() !== message.getRequiredId()) {
    await untilMessageAcknowledged(consumer, msg);
  }
}

export async function untilConsumerEvent(
  consumer: Consumer,
  event: string,
): Promise<unknown[]> {
  return consumerOnEvent(consumer, event);
}
