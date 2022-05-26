import { TRouteControllerActionHandler } from '../../../../../../common/routing';
import { GetAcknowledgedMessagesRequestDTO } from './get-acknowledged-messages.request.DTO';
import { GetAcknowledgedMessagesResponseDTO } from './get-acknowledged-messages.response.DTO';
import { MessagesService } from '../../../../../../services/messages.service';
import { registry } from '../../../../../../lib/registry';

export const GetAcknowledgedMessagesHandler: TRouteControllerActionHandler<
  GetAcknowledgedMessagesRequestDTO,
  GetAcknowledgedMessagesResponseDTO
> = () => {
  return async (ctx) => {
    return (
      await MessagesService.getInstance(registry)
    ).getAcknowledgedMessages(ctx.state.dto);
  };
};
