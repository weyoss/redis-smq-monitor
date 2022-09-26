import { promisifyAll } from 'bluebird';
import { FanOutExchangeManager } from 'redis-smq';
import { TConfig } from '../../types';

const FanOutExchangeManagerAsync = promisifyAll(FanOutExchangeManager);
let fanOutExchangeManager: FanOutExchangeManager | null = null;

export async function getFanOutExchangeManagerInstance(config: TConfig) {
  if (!fanOutExchangeManager) {
    fanOutExchangeManager =
      await FanOutExchangeManagerAsync.createInstanceAsync(config);
  }
  return fanOutExchangeManager;
}

export async function destroyFanOutExchangeManager() {
  if (fanOutExchangeManager) {
    await promisifyAll(fanOutExchangeManager).quitAsync();
    fanOutExchangeManager = null;
  }
}
