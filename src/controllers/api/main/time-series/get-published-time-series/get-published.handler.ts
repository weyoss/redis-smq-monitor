import { TRouteControllerActionHandler } from '../../../../../common/routing';
import { GetPublishedRequestDTO } from './get-published.request.DTO';
import { GetPublishedResponseDTO } from './get-published.response.DTO';
import { GlobalTimeSeriesService } from '../../../../../services/global-time-series.service';
import { registry } from '../../../../../lib/registry';

export const GetPublishedHandler: TRouteControllerActionHandler<
  GetPublishedRequestDTO,
  GetPublishedResponseDTO
> = () => {
  return async (ctx) => {
    return (await GlobalTimeSeriesService.getInstance(registry)).published(
      ctx.state.dto,
    );
  };
};
