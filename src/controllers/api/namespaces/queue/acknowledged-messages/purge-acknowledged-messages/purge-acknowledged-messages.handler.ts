import { TRouteControllerActionHandler } from '../../../../../../common/routing';
import { PurgeAcknowledgedMessagesRequestDTO } from './purge-acknowledged-messages.request.DTO';
import { PurgeAcknowledgedMessagesResponseDTO } from './purge-acknowledged-messages.response.DTO';
import { MessagesService } from '../../../../../../services/messages.service';
import { registry } from '../../../../../../lib/registry';

export const PurgeAcknowledgedMessagesHandler: TRouteControllerActionHandler<
  PurgeAcknowledgedMessagesRequestDTO,
  PurgeAcknowledgedMessagesResponseDTO
> = () => {
  return async (ctx) => {
    return (
      await MessagesService.getInstance(registry)
    ).purgeAcknowledgedMessages(ctx.state.dto);
  };
};
