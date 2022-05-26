import { promisifyAll } from 'bluebird';
import { GetScheduledMessagesRequestDTO } from '../controllers/api/main/scheduled-messages/get-scheduled-messages/get-scheduled-messages.request.DTO';
import { GetPendingMessagesRequestDTO } from '../controllers/api/namespaces/queue/pending-messages/get-pending-messages/get-pending-messages.request.DTO';
import { GetAcknowledgedMessagesRequestDTO } from '../controllers/api/namespaces/queue/acknowledged-messages/get-acknowledged-messages/get-acknowledged-messages.request.DTO';
import { GetDeadLetteredMessagesRequestDTO } from '../controllers/api/namespaces/queue/dead-lettered-messages/get-dead-lettered-messages/get-dead-lettered-messages.request.DTO';
import { DeletePendingMessageRequestDTO } from '../controllers/api/namespaces/queue/pending-messages/delete-pending-message/delete-pending-message.request.DTO';
import { DeleteAcknowledgedMessageRequestDTO } from '../controllers/api/namespaces/queue/acknowledged-messages/delete-acknowledged-message/delete-acknowledged-message.request.DTO';
import { DeleteDeadLetteredMessageRequestDTO } from '../controllers/api/namespaces/queue/dead-lettered-messages/delete-dead-lettered-message/delete-dead-lettered-message.request.DTO';
import { DeleteScheduledMessageRequestDTO } from '../controllers/api/main/scheduled-messages/delete-scheduled-message/delete-scheduled-message-request.DTO';
import { RequeueDeadLetteredMessageRequestDTO } from '../controllers/api/namespaces/queue/dead-lettered-messages/requeue-dead-lettered-message/requeue-dead-lettered-message.request.DTO';
import { RequeueAcknowledgedMessageRequestDTO } from '../controllers/api/namespaces/queue/acknowledged-messages/requeue-acknowledged-message/requeue-acknowledged-message.request.DTO';
import { PurgeDeadLetteredMessagesRequestDTO } from '../controllers/api/namespaces/queue/dead-lettered-messages/purge-dead-lettered-messages/purge-dead-lettered-messages.request.DTO';
import { PurgeAcknowledgedMessagesRequestDTO } from '../controllers/api/namespaces/queue/acknowledged-messages/purge-acknowledged-messages/purge-acknowledged-messages.request.DTO';
import { PurgePendingMessagesRequestDTO } from '../controllers/api/namespaces/queue/pending-messages/purge-pending-messages/purge-pending-messages.request.DTO';
import { MessageManager } from 'redis-smq';
import { getMessageManagerInstance } from '../lib/message-manager';
import { TRegistry } from '../lib/registry';

export class MessagesService {
  protected static instance: MessagesService | null = null;
  protected scheduledMessages;
  protected acknowledgedMessages;
  protected pendingMessages;
  protected deadLetteredMessages;

  protected constructor(messageManager: MessageManager) {
    this.scheduledMessages = promisifyAll(messageManager.scheduledMessages);
    this.acknowledgedMessages = promisifyAll(
      messageManager.acknowledgedMessages,
    );
    this.pendingMessages = promisifyAll(messageManager.pendingMessages);
    this.deadLetteredMessages = promisifyAll(
      messageManager.deadLetteredMessages,
    );
  }

  async getScheduledMessages(args: GetScheduledMessagesRequestDTO) {
    const { skip = 0, take = 1 } = args;
    const r = await this.scheduledMessages.listAsync(skip, take);
    return {
      ...r,
      items: r.items.map((i) => ({ ...i, message: i.message.toJSON() })),
    };
  }

  async getPendingMessages(args: GetPendingMessagesRequestDTO) {
    const { ns, queueName, skip = 0, take = 1 } = args;
    const r = await this.pendingMessages.listAsync(
      {
        name: queueName,
        ns,
      },
      skip,
      take,
    );
    return {
      ...r,
      items: r.items.map((i) => ({ ...i, message: i.message.toJSON() })),
    };
  }

  async getAcknowledgedMessages(args: GetAcknowledgedMessagesRequestDTO) {
    const { ns, queueName, skip = 0, take = 1 } = args;
    const r = await this.acknowledgedMessages.listAsync(
      {
        name: queueName,
        ns,
      },
      skip,
      take,
    );
    return {
      ...r,
      items: r.items.map((i) => ({ ...i, message: i.message.toJSON() })),
    };
  }

  async getDeadLetteredMessages(args: GetDeadLetteredMessagesRequestDTO) {
    const { ns, queueName, skip = 0, take = 1 } = args;
    const r = await this.deadLetteredMessages.listAsync(
      {
        name: queueName,
        ns,
      },
      skip,
      take,
    );
    return {
      ...r,
      items: r.items.map((i) => ({ ...i, message: i.message.toJSON() })),
    };
  }

  async deletePendingMessage(
    args: DeletePendingMessageRequestDTO,
  ): Promise<void> {
    const { ns, queueName, id, sequenceId } = args;
    return this.pendingMessages.deleteAsync(
      {
        name: queueName,
        ns,
      },
      id,
      sequenceId,
    );
  }

  async deleteAcknowledgedMessage(
    args: DeleteAcknowledgedMessageRequestDTO,
  ): Promise<void> {
    const { ns, queueName, id, sequenceId } = args;
    return this.acknowledgedMessages.deleteAsync(
      {
        name: queueName,
        ns,
      },
      id,
      sequenceId,
    );
  }

  async deleteDeadLetteredMessage(
    args: DeleteDeadLetteredMessageRequestDTO,
  ): Promise<void> {
    const { ns, queueName, id, sequenceId } = args;
    return this.deadLetteredMessages.deleteAsync(
      {
        name: queueName,
        ns,
      },
      id,
      sequenceId,
    );
  }

  async deleteScheduledMessage(
    args: DeleteScheduledMessageRequestDTO,
  ): Promise<void> {
    const { id } = args;
    return this.scheduledMessages.deleteAsync(id);
  }

  async requeueDeadLetteredMessage(
    args: RequeueDeadLetteredMessageRequestDTO,
  ): Promise<void> {
    const { ns, queueName, id, sequenceId } = args;
    return this.deadLetteredMessages.requeueAsync(
      {
        name: queueName,
        ns,
      },
      id,
      sequenceId,
    );
  }

  async requeueAcknowledgedMessage(
    args: RequeueAcknowledgedMessageRequestDTO,
  ): Promise<void> {
    const { ns, queueName, id, sequenceId } = args;
    return this.acknowledgedMessages.requeueAsync(
      {
        name: queueName,
        ns,
      },
      id,
      sequenceId,
    );
  }

  async purgeDeadLetteredMessages(
    args: PurgeDeadLetteredMessagesRequestDTO,
  ): Promise<void> {
    const { ns, queueName } = args;
    return this.deadLetteredMessages.purgeAsync({
      name: queueName,
      ns,
    });
  }

  async purgeAcknowledgedMessages(
    args: PurgeAcknowledgedMessagesRequestDTO,
  ): Promise<void> {
    const { ns, queueName } = args;
    return this.acknowledgedMessages.purgeAsync({
      name: queueName,
      ns,
    });
  }

  async purgePendingMessages(
    args: PurgePendingMessagesRequestDTO,
  ): Promise<void> {
    const { ns, queueName } = args;
    return this.pendingMessages.purgeAsync({
      name: queueName,
      ns,
    });
  }

  async purgeScheduledMessages(): Promise<void> {
    return this.scheduledMessages.purgeAsync();
  }

  static async getInstance(registry: TRegistry) {
    if (!MessagesService.instance) {
      const config = registry.getItem('config');
      const messageManager = await getMessageManagerInstance(config);
      MessagesService.instance = new MessagesService(messageManager);
    }
    return MessagesService.instance;
  }
}
