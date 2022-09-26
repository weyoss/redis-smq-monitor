import { TRouteControllerActionHandler } from '../../../../common/routing';
import { registry } from '../../../../lib/registry';
import { ExchangesService } from '../../../../services/exchanges.service';
import { GetExchangeQueuesRequestDTO } from './get-exchange-queues.request.DTO';
import { GetExchangeQueuesResponseDTO } from './get-exchange-queues.response.DTO';

export const GetExchangeQueuesHandler: TRouteControllerActionHandler<
  GetExchangeQueuesRequestDTO,
  GetExchangeQueuesResponseDTO
> = () => async (ctx) => {
  return (await ExchangesService.getInstance(registry)).getExchangeQueues(
    ctx.state.dto,
  );
};
