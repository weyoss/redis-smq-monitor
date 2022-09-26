import { TRouteControllerActionHandler } from '../../../../common/routing';
import { registry } from '../../../../lib/registry';
import { ExchangesService } from '../../../../services/exchanges.service';
import { BindQueueRequestDTO } from './bind-queue.request.DTO';
import { BindQueueResponseDTO } from './bind-queue.response.DTO';

export const BindQueueHandler: TRouteControllerActionHandler<
  BindQueueRequestDTO,
  BindQueueResponseDTO
> = () => async (ctx) => {
  return (await ExchangesService.getInstance(registry)).bindQueue(
    ctx.state.dto,
  );
};
