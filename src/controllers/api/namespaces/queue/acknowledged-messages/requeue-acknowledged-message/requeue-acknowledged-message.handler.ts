import { TRouteControllerActionHandler } from '../../../../../../common/routing';
import { RequeueAcknowledgedMessageRequestDTO } from './requeue-acknowledged-message.request.DTO';
import { RequeueAcknowledgedMessageResponseDTO } from './requeue-acknowledged-message.response.DTO';
import { MessagesService } from '../../../../../../services/messages.service';
import { registry } from '../../../../../../lib/registry';

export const RequeueAcknowledgedMessageHandler: TRouteControllerActionHandler<
  RequeueAcknowledgedMessageRequestDTO,
  RequeueAcknowledgedMessageResponseDTO
> = () => {
  return async (ctx) => {
    await (
      await MessagesService.getInstance(registry)
    ).requeueAcknowledgedMessage(ctx.state.dto);
  };
};
