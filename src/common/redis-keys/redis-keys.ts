// Key segments separator
import { TQueueParams } from 'redis-smq/dist/types';

const keySegmentSeparator = ':';

// Key prefix
const nsPrefix = 'redis-smq-monitor-v700rc0';

// Namespaces
const globalNamespace = 'global';

enum ERedisKey {
  KEY_LOCK_MONITOR_WORKERS,
  KEY_RATE_CONSUMER_ACKNOWLEDGED,
  KEY_RATE_QUEUE_ACKNOWLEDGED,
  KEY_RATE_QUEUE_ACKNOWLEDGED_INDEX,
  KEY_RATE_QUEUE_DEAD_LETTERED,
  KEY_RATE_QUEUE_DEAD_LETTERED_INDEX,
  KEY_RATE_QUEUE_PUBLISHED,
  KEY_RATE_QUEUE_PUBLISHED_INDEX,
  KEY_RATE_GLOBAL_ACKNOWLEDGED,
  KEY_RATE_GLOBAL_ACKNOWLEDGED_INDEX,
  KEY_RATE_GLOBAL_DEAD_LETTERED,
  KEY_RATE_GLOBAL_DEAD_LETTERED_INDEX,
  KEY_RATE_GLOBAL_PUBLISHED,
  KEY_RATE_GLOBAL_PUBLISHED_INDEX,
  KEY_RATE_CONSUMER_DEAD_LETTERED,
}

function makeNamespacedKeys<T extends Record<string, ERedisKey>>(
  keys: T,
  namespace: string,
  ...rest: string[]
): Record<Extract<keyof T, string>, string> {
  const result: Record<string, string> = {};
  for (const k in keys) {
    result[k] = [nsPrefix, namespace, keys[k], ...rest].join(
      keySegmentSeparator,
    );
  }
  return result;
}

export const redisKeys = {
  getMainKeys() {
    const mainKeys = {
      keyLockMonitorWorkers: ERedisKey.KEY_LOCK_MONITOR_WORKERS,
      keyRateGlobalDeadLettered: ERedisKey.KEY_RATE_GLOBAL_DEAD_LETTERED,
      keyRateGlobalAcknowledged: ERedisKey.KEY_RATE_GLOBAL_ACKNOWLEDGED,
      keyRateGlobalPublished: ERedisKey.KEY_RATE_GLOBAL_PUBLISHED,
      keyRateGlobalDeadLetteredIndex:
        ERedisKey.KEY_RATE_GLOBAL_DEAD_LETTERED_INDEX,
      keyRateGlobalAcknowledgedIndex:
        ERedisKey.KEY_RATE_GLOBAL_ACKNOWLEDGED_INDEX,
      keyRateGlobalInputIndex: ERedisKey.KEY_RATE_GLOBAL_PUBLISHED_INDEX,
    };
    return makeNamespacedKeys(mainKeys, globalNamespace);
  },
  getConsumerKeys(instanceId: string) {
    const mainKeys = this.getMainKeys();
    const consumerKeys = {
      keyRateConsumerDeadLettered: ERedisKey.KEY_RATE_CONSUMER_DEAD_LETTERED,
      keyRateConsumerAcknowledged: ERedisKey.KEY_RATE_CONSUMER_ACKNOWLEDGED,
    };
    return {
      ...mainKeys,
      ...makeNamespacedKeys(consumerKeys, globalNamespace, instanceId),
    };
  },
  getQueueKeys(queueParams: TQueueParams) {
    const mainKeys = this.getMainKeys();
    const queueKeys = {
      keyRateQueueDeadLettered: ERedisKey.KEY_RATE_QUEUE_DEAD_LETTERED,
      keyRateQueueAcknowledged: ERedisKey.KEY_RATE_QUEUE_ACKNOWLEDGED,
      keyRateQueuePublished: ERedisKey.KEY_RATE_QUEUE_PUBLISHED,
      keyRateQueueDeadLetteredIndex:
        ERedisKey.KEY_RATE_QUEUE_DEAD_LETTERED_INDEX,
      keyRateQueueAcknowledgedIndex:
        ERedisKey.KEY_RATE_QUEUE_ACKNOWLEDGED_INDEX,
      keyRateQueuePublishedIndex: ERedisKey.KEY_RATE_QUEUE_PUBLISHED_INDEX,
    };
    return {
      ...mainKeys,
      ...makeNamespacedKeys(queueKeys, queueParams.ns, queueParams.name),
    };
  },
};
