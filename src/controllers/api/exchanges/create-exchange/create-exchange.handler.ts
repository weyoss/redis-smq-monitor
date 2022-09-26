import { TRouteControllerActionHandler } from '../../../../common/routing';
import { registry } from '../../../../lib/registry';
import { ExchangesService } from '../../../../services/exchanges.service';
import { CreateExchangeRequestDTO } from './create-exchange.request.DTO';
import { CreateExchangeResponseDTO } from './create-exchange.response.DTO';

export const CreateExchangeHandler: TRouteControllerActionHandler<
  CreateExchangeRequestDTO,
  CreateExchangeResponseDTO
> = () => async (ctx) => {
  return (await ExchangesService.getInstance(registry)).saveExchange(
    ctx.state.dto,
  );
};
