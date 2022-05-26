import { TRouteControllerActionHandler } from '../../../../../../common/routing';
import { DeleteDeadLetteredMessageRequestDTO } from './delete-dead-lettered-message.request.DTO';
import { DeleteDeadLetteredMessageResponseDTO } from './delete-dead-lettered-message.response.DTO';
import { MessagesService } from '../../../../../../services/messages.service';
import { registry } from '../../../../../../lib/registry';

export const DeleteDeadLetteredMessageHandler: TRouteControllerActionHandler<
  DeleteDeadLetteredMessageRequestDTO,
  DeleteDeadLetteredMessageResponseDTO
> = () => {
  return async (ctx) => {
    return (
      await MessagesService.getInstance(registry)
    ).deleteDeadLetteredMessage(ctx.state.dto);
  };
};
