import { Message } from 'redis-smq';

export async function initialize() {
  Message.setDefaultConsumeOptions({ retryDelay: 0 });
}
