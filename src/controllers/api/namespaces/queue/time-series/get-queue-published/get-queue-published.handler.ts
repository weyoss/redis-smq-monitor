import { TRouteControllerActionHandler } from '../../../../../../common/routing';
import { GetQueuePublishedRequestDTO } from './get-queue-published.request.DTO';
import { GetQueuePublishedResponseDTO } from './get-queue-published.response.DTO';
import { QueueTimeSeriesService } from '../../../../../../services/queue-time-series.service';
import { registry } from '../../../../../../lib/registry';

export const GetQueuePublishedHandler: TRouteControllerActionHandler<
  GetQueuePublishedRequestDTO,
  GetQueuePublishedResponseDTO
> = () => {
  return async (ctx) => {
    return (await QueueTimeSeriesService.getInstance(registry)).published(
      ctx.state.dto,
    );
  };
};
