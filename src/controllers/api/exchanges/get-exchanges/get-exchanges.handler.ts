import { TRouteControllerActionHandler } from '../../../../common/routing';
import { registry } from '../../../../lib/registry';
import { GetExchangesRequestDTO } from './get-exchanges.request.DTO';
import { GetExchangesResponseDTO } from './get-exchanges.response.DTO';
import { ExchangesService } from '../../../../services/exchanges.service';

export const GetExchangesHandler: TRouteControllerActionHandler<
  GetExchangesRequestDTO,
  GetExchangesResponseDTO
> = () => async () => {
  return (await ExchangesService.getInstance(registry)).getExchanges();
};
