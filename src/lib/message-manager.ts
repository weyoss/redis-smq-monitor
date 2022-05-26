import { MessageManager } from 'redis-smq';
import { TConfig } from '../../types';
import { promisifyAll } from 'bluebird';

const MessageManagerAsync = promisifyAll(MessageManager);
let messageManager: MessageManager | null = null;

export async function getMessageManagerInstance(config: TConfig) {
  if (!messageManager) {
    messageManager = await MessageManagerAsync.createInstanceAsync(config);
  }
  return messageManager;
}

export async function destroyMessageManager() {
  if (messageManager) {
    await promisifyAll(messageManager).quitAsync();
    messageManager = null;
  }
}
