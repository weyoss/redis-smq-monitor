import { TRouteControllerActionHandler } from '../../../../../../common/routing';
import { PurgeDeadLetteredMessagesRequestDTO } from './purge-dead-lettered-messages.request.DTO';
import { PurgeDeadLetteredMessagesResponseDTO } from './purge-dead-lettered-messages.response.DTO';
import { MessagesService } from '../../../../../../services/messages.service';
import { registry } from '../../../../../../lib/registry';

export const PurgeDeadLetteredMessagesHandler: TRouteControllerActionHandler<
  PurgeDeadLetteredMessagesRequestDTO,
  PurgeDeadLetteredMessagesResponseDTO
> = () => {
  return async (ctx) => {
    return (
      await MessagesService.getInstance(registry)
    ).purgeDeadLetteredMessages(ctx.state.dto);
  };
};
