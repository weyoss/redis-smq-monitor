import { promisifyAll } from 'bluebird';
import { TQueueParams, TQueueSettings } from 'redis-smq/dist/types';
import { DeleteQueueRequestDTO } from '../controllers/api/namespaces/queue/delete-queue/delete-queue.request.DTO';
import { GetNamespaceQueuesRequestDTO } from '../controllers/api/namespaces/get-namespace-queues/get-namespace-queues.request.DTO';
import { DeleteNamespaceRequestDTO } from '../controllers/api/namespaces/delete-namespace/delete-namespace.request.DTO';
import { SetRateLimitRequestDTO } from '../controllers/api/namespaces/queue/rate-limiting/set-rate-limit/set-rate-limit.request.DTO';
import { ClearRateLimitRequestDTO } from '../controllers/api/namespaces/queue/rate-limiting/clear-rate-limit/clear-rate-limit.request.DTO';
import { GetRateLimitRequestDTO } from '../controllers/api/namespaces/queue/rate-limiting/get-rate-limit/get-rate-limit.request.DTO';
import { QueueManager } from 'redis-smq';
import { getQueueManagerInstance } from '../lib/queue-manager';
import { TRegistry } from '../lib/registry';
import { CreateQueueRequestDTO } from '../controllers/api/queues/create-queue/create-queue.request.DTO';

export class QueuesService {
  protected static instance: QueuesService | null = null;
  protected queue;
  protected namespace;
  protected queueRateLimit;

  protected constructor(queueManager: QueueManager) {
    this.queue = promisifyAll(queueManager.queue);
    this.namespace = promisifyAll(queueManager.namespace);
    this.queueRateLimit = promisifyAll(queueManager.queueRateLimit);
  }

  async getNamespaces(): Promise<string[]> {
    return this.namespace.listAsync();
  }

  async createQueue(
    args: CreateQueueRequestDTO,
  ): Promise<{ queue: TQueueParams; settings: TQueueSettings }> {
    const { ns, name, enablePriorityQueuing } = args;
    const queueParams: TQueueParams | string = ns && name ? { name, ns } : name;
    return this.queue.createAsync(queueParams, enablePriorityQueuing);
  }

  async getNamespaceQueues(
    args: GetNamespaceQueuesRequestDTO,
  ): Promise<TQueueParams[]> {
    const { ns } = args;
    return this.namespace.getQueuesAsync(ns);
  }

  async deleteNamespace(args: DeleteNamespaceRequestDTO): Promise<void> {
    const { ns } = args;
    return this.namespace.deleteAsync(ns);
  }

  async getQueues(): Promise<TQueueParams[]> {
    return this.queue.listAsync();
  }

  async deleteQueue(args: DeleteQueueRequestDTO): Promise<void> {
    const { ns, queueName } = args;
    return this.queue.deleteAsync({
      name: queueName,
      ns,
    });
  }

  async setQueueRateLimit(args: SetRateLimitRequestDTO) {
    const { ns, queueName, interval, limit } = args;
    return this.queueRateLimit.setAsync(
      { name: queueName, ns },
      { interval, limit },
    );
  }

  async clearQueueRateLimit(args: ClearRateLimitRequestDTO) {
    const { ns, queueName } = args;
    return this.queueRateLimit.clearAsync({
      name: queueName,
      ns,
    });
  }

  async getQueueRateLimit(args: GetRateLimitRequestDTO) {
    const { ns, queueName } = args;
    return this.queueRateLimit.getAsync({ name: queueName, ns });
  }

  static async getInstance(registry: TRegistry) {
    if (!QueuesService.instance) {
      const config = registry.getItem('config');
      const queueManager = await getQueueManagerInstance(config);
      QueuesService.instance = new QueuesService(queueManager);
    }
    return QueuesService.instance;
  }
}
