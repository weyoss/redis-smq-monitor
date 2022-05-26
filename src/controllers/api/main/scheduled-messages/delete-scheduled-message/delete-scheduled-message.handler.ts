import { TRouteControllerActionHandler } from '../../../../../common/routing';
import { DeleteScheduledMessageRequestDTO } from './delete-scheduled-message-request.DTO';
import { DeleteScheduledMessageResponseDTO } from './delete-scheduled-message-response.DTO';
import { MessagesService } from '../../../../../services/messages.service';
import { registry } from '../../../../../lib/registry';

export const DeleteScheduledMessageHandler: TRouteControllerActionHandler<
  DeleteScheduledMessageRequestDTO,
  DeleteScheduledMessageResponseDTO
> = () => {
  return async (ctx) => {
    return (await MessagesService.getInstance(registry)).deleteScheduledMessage(
      ctx.state.dto,
    );
  };
};
