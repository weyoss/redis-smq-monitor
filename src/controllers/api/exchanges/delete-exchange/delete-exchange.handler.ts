import { TRouteControllerActionHandler } from '../../../../common/routing';
import { registry } from '../../../../lib/registry';
import { ExchangesService } from '../../../../services/exchanges.service';
import { DeleteExchangeRequestDTO } from './delete-exchange.request.DTO';
import { DeleteExchangeResponseDTO } from './delete-exchange.response.DTO';

export const DeleteExchangeHandler: TRouteControllerActionHandler<
  DeleteExchangeRequestDTO,
  DeleteExchangeResponseDTO
> = () => async (ctx) => {
  return (await ExchangesService.getInstance(registry)).deleteExchange(
    ctx.state.dto,
  );
};
