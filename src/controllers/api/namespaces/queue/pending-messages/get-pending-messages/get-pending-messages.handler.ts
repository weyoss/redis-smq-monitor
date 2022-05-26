import { TRouteControllerActionHandler } from '../../../../../../common/routing';
import { GetPendingMessagesRequestDTO } from './get-pending-messages.request.DTO';
import { GetPendingMessagesResponseDTO } from './get-pending-messages.response.DTO';
import { MessagesService } from '../../../../../../services/messages.service';
import { registry } from '../../../../../../lib/registry';

export const GetPendingMessagesHandler: TRouteControllerActionHandler<
  GetPendingMessagesRequestDTO,
  GetPendingMessagesResponseDTO
> = () => {
  return async (ctx) => {
    return (await MessagesService.getInstance(registry)).getPendingMessages(
      ctx.state.dto,
    );
  };
};
