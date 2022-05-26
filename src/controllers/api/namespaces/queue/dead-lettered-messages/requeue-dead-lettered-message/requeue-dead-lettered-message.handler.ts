import { TRouteControllerActionHandler } from '../../../../../../common/routing';
import { RequeueDeadLetteredMessageRequestDTO } from './requeue-dead-lettered-message.request.DTO';
import { RequeueDeadLetteredMessageResponseDTO } from './requeue-dead-lettered-message.response.DTO';
import { MessagesService } from '../../../../../../services/messages.service';
import { registry } from '../../../../../../lib/registry';

export const RequeueDeadLetteredMessageHandler: TRouteControllerActionHandler<
  RequeueDeadLetteredMessageRequestDTO,
  RequeueDeadLetteredMessageResponseDTO
> = () => {
  return async (ctx) => {
    await (
      await MessagesService.getInstance(registry)
    ).requeueDeadLetteredMessage(ctx.state.dto);
  };
};
