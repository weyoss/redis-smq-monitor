import { TRouteControllerActionHandler } from '../../../../../../common/routing';
import { GetQueueDeadLetteredRequestDTO } from './get-queue-dead-lettered.request.DTO';
import { GetQueueDeadLetteredResponseDTO } from './get-queue-dead-lettered.response.DTO';
import { QueueTimeSeriesService } from '../../../../../../services/queue-time-series.service';
import { registry } from '../../../../../../lib/registry';

export const GetQueueDeadLetteredHandler: TRouteControllerActionHandler<
  GetQueueDeadLetteredRequestDTO,
  GetQueueDeadLetteredResponseDTO
> = () => {
  return async (ctx) => {
    return (await QueueTimeSeriesService.getInstance(registry)).deadLettered(
      ctx.state.dto,
    );
  };
};
