import { TRouteControllerActionHandler } from '../../../../common/routing';
import { registry } from '../../../../lib/registry';
import { ExchangesService } from '../../../../services/exchanges.service';
import { UnbindQueueRequestDTO } from './unbind-queue.request.DTO';
import { UnbindQueueResponseDTO } from './unbind-queue.response.DTO';

export const UnbindQueueHandler: TRouteControllerActionHandler<
  UnbindQueueRequestDTO,
  UnbindQueueResponseDTO
> = () => async (ctx) => {
  return (await ExchangesService.getInstance(registry)).unbindQueue(
    ctx.state.dto,
  );
};
