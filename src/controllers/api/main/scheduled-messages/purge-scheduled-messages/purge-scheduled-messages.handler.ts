import { TRouteControllerActionHandler } from '../../../../../common/routing';
import { PurgeScheduledMessagesRequestDTO } from './purge-scheduled-messages.request.DTO';
import { PurgeScheduledMessagesResponseDTO } from './purge-scheduled-messages.response.DTO';
import { MessagesService } from '../../../../../services/messages.service';
import { registry } from '../../../../../lib/registry';

export const PurgeScheduledMessagesHandler: TRouteControllerActionHandler<
  PurgeScheduledMessagesRequestDTO,
  PurgeScheduledMessagesResponseDTO
> = () => {
  return async () => {
    return (
      await MessagesService.getInstance(registry)
    ).purgeScheduledMessages();
  };
};
