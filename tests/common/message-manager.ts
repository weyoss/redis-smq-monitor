import { IConfig } from 'redis-smq/dist/types';
import { config } from './config';
import { promisifyAll } from 'bluebird';
import { MessageManager } from 'redis-smq';

const MessageManagerAsync = promisifyAll(MessageManager);

let messageManager: MessageManager | null = null;

export async function getMessageManager(cfg: IConfig = config) {
  if (!messageManager) {
    messageManager = await MessageManagerAsync.createInstanceAsync(cfg);
  }
  return messageManager;
}

export async function getMessageManagerAsync(cfg: IConfig = config) {
  const messageManager = await getMessageManager(cfg);
  return {
    deadLetteredMessages: promisifyAll(messageManager.deadLetteredMessages),
    acknowledgedMessages: promisifyAll(messageManager.acknowledgedMessages),
    pendingMessages: promisifyAll(messageManager.pendingMessages),
    scheduledMessages: promisifyAll(messageManager.scheduledMessages),
  };
}

export async function shutdownMessageManager() {
  if (messageManager) {
    await promisifyAll(messageManager).quitAsync();
    messageManager = null;
  }
}
