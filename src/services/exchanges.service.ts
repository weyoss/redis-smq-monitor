import { promisifyAll } from 'bluebird';
import { FanOutExchange, FanOutExchangeManager } from 'redis-smq';
import { TRegistry } from '../lib/registry';
import { getFanOutExchangeManagerInstance } from '../lib/fan-out-exchange-manager';
import { TQueueParams } from 'redis-smq/dist/types';
import { GetExchangeQueuesRequestDTO } from '../controllers/api/exchanges/get-exchange-queues/get-exchange-queues.request.DTO';
import { BindQueueRequestDTO } from '../controllers/api/exchanges/bind-queue/bind-queue.request.DTO';
import { CreateExchangeRequestDTO } from '../controllers/api/exchanges/create-exchange/create-exchange.request.DTO';
import { DeleteExchangeRequestDTO } from '../controllers/api/exchanges/delete-exchange/delete-exchange.request.DTO';

export class ExchangesService {
  protected static instance: ExchangesService | null = null;
  protected fanOutExchangeManager;

  protected constructor(fanOutExchangeManager: FanOutExchangeManager) {
    this.fanOutExchangeManager = promisifyAll(fanOutExchangeManager);
  }

  async getExchanges(): Promise<string[]> {
    return this.fanOutExchangeManager.getExchangesAsync();
  }

  async getExchangeQueues({
    exchangeName,
  }: GetExchangeQueuesRequestDTO): Promise<TQueueParams[]> {
    const e = new FanOutExchange(exchangeName);
    return this.fanOutExchangeManager.getExchangeQueuesAsync(e);
  }

  async bindQueue({ exchangeName, queue }: BindQueueRequestDTO): Promise<void> {
    const e = new FanOutExchange(exchangeName);
    return this.fanOutExchangeManager.bindQueueAsync(queue, e);
  }

  async unbindQueue({
    exchangeName,
    queue,
  }: BindQueueRequestDTO): Promise<void> {
    const e = new FanOutExchange(exchangeName);
    return this.fanOutExchangeManager.unbindQueueAsync(queue, e);
  }

  async saveExchange({
    exchangeName,
  }: CreateExchangeRequestDTO): Promise<string[]> {
    const e = new FanOutExchange(exchangeName);
    await this.fanOutExchangeManager.saveExchangeAsync(e);
    return this.fanOutExchangeManager.getExchangesAsync();
  }

  async deleteExchange({
    exchangeName,
  }: DeleteExchangeRequestDTO): Promise<string[]> {
    const e = new FanOutExchange(exchangeName);
    await this.fanOutExchangeManager.deleteExchangeAsync(e);
    return this.fanOutExchangeManager.getExchangesAsync();
  }

  static async getInstance(registry: TRegistry) {
    if (!ExchangesService.instance) {
      const config = registry.getItem('config');
      const instance = await getFanOutExchangeManagerInstance(config);
      ExchangesService.instance = new ExchangesService(instance);
    }
    return ExchangesService.instance;
  }
}
