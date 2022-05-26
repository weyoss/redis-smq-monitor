import { TRouteControllerActionHandler } from '../../../../../../common/routing';
import { DeletePendingMessageRequestDTO } from './delete-pending-message.request.DTO';
import { DeletePendingMessageResponseDTO } from './delete-pending-message.response.DTO';
import { registry } from '../../../../../../lib/registry';
import { MessagesService } from '../../../../../../services/messages.service';

export const DeletePendingMessageHandler: TRouteControllerActionHandler<
  DeletePendingMessageRequestDTO,
  DeletePendingMessageResponseDTO
> = () => {
  return async (ctx) => {
    return (await MessagesService.getInstance(registry)).deletePendingMessage(
      ctx.state.dto,
    );
  };
};
