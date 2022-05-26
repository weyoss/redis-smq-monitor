import { TRouteControllerActionHandler } from '../../../../../../common/routing';
import { GetQueueAcknowledgedRequestDTO } from './get-queue-acknowledged.request.DTO';
import { GetQueueAcknowledgedResponseDTO } from './get-queue-acknowledged.response.DTO';
import { QueueTimeSeriesService } from '../../../../../../services/queue-time-series.service';
import { registry } from '../../../../../../lib/registry';

export const GetQueueAcknowledgedHandler: TRouteControllerActionHandler<
  GetQueueAcknowledgedRequestDTO,
  GetQueueAcknowledgedResponseDTO
> = () => {
  return async (ctx) => {
    return (await QueueTimeSeriesService.getInstance(registry)).acknowledged(
      ctx.state.dto,
    );
  };
};
