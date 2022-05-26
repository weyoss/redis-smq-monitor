import { TRouteControllerActionHandler } from '../../../../../common/routing';
import { GetDeadLetteredRequestDTO } from './get-dead-lettered.request.DTO';
import { GetDeadLetteredResponseDTO } from './get-dead-lettered.response.DTO';
import { GlobalTimeSeriesService } from '../../../../../services/global-time-series.service';
import { registry } from '../../../../../lib/registry';

export const GetDeadLetteredHandler: TRouteControllerActionHandler<
  GetDeadLetteredRequestDTO,
  GetDeadLetteredResponseDTO
> = () => {
  return async (ctx) => {
    return (await GlobalTimeSeriesService.getInstance(registry)).deadLettered(
      ctx.state.dto,
    );
  };
};
