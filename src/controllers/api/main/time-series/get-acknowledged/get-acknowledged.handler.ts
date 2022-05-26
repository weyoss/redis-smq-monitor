import { TRouteControllerActionHandler } from '../../../../../common/routing';
import { GetAcknowledgedRequestDTO } from './get-acknowledged.request.DTO';
import { GetAcknowledgedResponseDTO } from './get-acknowledged.response.DTO';
import { GlobalTimeSeriesService } from '../../../../../services/global-time-series.service';
import { registry } from '../../../../../lib/registry';

export const GetAcknowledgedHandler: TRouteControllerActionHandler<
  GetAcknowledgedRequestDTO,
  GetAcknowledgedResponseDTO
> = () => {
  return async (ctx) => {
    return (await GlobalTimeSeriesService.getInstance(registry)).acknowledged(
      ctx.state.dto,
    );
  };
};
