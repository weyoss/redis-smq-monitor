import { TRouteControllerActionHandler } from '../../../../../common/routing';
import { GetScheduledMessagesRequestDTO } from './get-scheduled-messages.request.DTO';
import { GetScheduledMessagesResponseDTO } from './get-scheduled-messages.response.DTO';
import { MessagesService } from '../../../../../services/messages.service';
import { registry } from '../../../../../lib/registry';

export const GetScheduledMessagesHandler: TRouteControllerActionHandler<
  GetScheduledMessagesRequestDTO,
  GetScheduledMessagesResponseDTO
> = () => {
  return async (ctx) => {
    return (await MessagesService.getInstance(registry)).getScheduledMessages(
      ctx.state.dto,
    );
  };
};
