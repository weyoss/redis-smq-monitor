import { TRouteControllerActionHandler } from '../../../../../../common/routing';
import { GetDeadLetteredMessagesRequestDTO } from './get-dead-lettered-messages.request.DTO';
import { GetDeadLetteredMessagesResponseDTO } from './get-dead-lettered-messages.response.DTO';
import { MessagesService } from '../../../../../../services/messages.service';
import { registry } from '../../../../../../lib/registry';

export const GetDeadLetteredMessagesHandler: TRouteControllerActionHandler<
  GetDeadLetteredMessagesRequestDTO,
  GetDeadLetteredMessagesResponseDTO
> = () => {
  return async (ctx) => {
    return (
      await MessagesService.getInstance(registry)
    ).getDeadLetteredMessages(ctx.state.dto);
  };
};
