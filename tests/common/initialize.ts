import {
  Message,
  registerProducerPlugin,
  registerConsumerPlugin,
} from 'redis-smq';
import { ConsumerMessageRatePlugin } from '../../src/plugins/message-rate/consumer-message-rate-plugin';
import { ProducerMessageRatePlugin } from '../../src/plugins/message-rate/producer-message-rate-plugin';

registerProducerPlugin(ProducerMessageRatePlugin);
registerConsumerPlugin(ConsumerMessageRatePlugin);

export async function initialize() {
  Message.setDefaultConsumeOptions({ retryDelay: 0 });
}
