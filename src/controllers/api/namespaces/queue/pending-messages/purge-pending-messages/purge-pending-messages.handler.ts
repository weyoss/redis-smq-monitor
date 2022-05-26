import { TRouteControllerActionHandler } from '../../../../../../common/routing';
import { PurgePendingMessagesRequestDTO } from './purge-pending-messages.request.DTO';
import { PurgePendingMessagesResponseDTO } from './purge-pending-messages.response.DTO';
import { MessagesService } from '../../../../../../services/messages.service';
import { registry } from '../../../../../../lib/registry';

export const PurgePendingMessagesHandler: TRouteControllerActionHandler<
  PurgePendingMessagesRequestDTO,
  PurgePendingMessagesResponseDTO
> = () => {
  return async (ctx) => {
    return (await MessagesService.getInstance(registry)).purgePendingMessages(
      ctx.state.dto,
    );
  };
};
