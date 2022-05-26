import { TRouteControllerActionHandler } from '../../../../../../common/routing';
import { DeleteAcknowledgedMessageRequestDTO } from './delete-acknowledged-message.request.DTO';
import { DeleteAcknowledgedMessageResponseDTO } from './delete-acknowledged-message.response.DTO';
import { MessagesService } from '../../../../../../services/messages.service';
import { registry } from '../../../../../../lib/registry';

export const DeleteAcknowledgedMessageHandler: TRouteControllerActionHandler<
  DeleteAcknowledgedMessageRequestDTO,
  DeleteAcknowledgedMessageResponseDTO
> = () => {
  return async (ctx) => {
    return (
      await MessagesService.getInstance(registry)
    ).deleteAcknowledgedMessage(ctx.state.dto);
  };
};
