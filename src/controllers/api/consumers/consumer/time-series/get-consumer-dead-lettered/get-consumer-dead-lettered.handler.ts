import { TRouteControllerActionHandler } from '../../../../../../common/routing';
import { GetConsumerDeadLetteredRequestDTO } from './get-consumer-dead-lettered.request.DTO';
import { GetConsumerDeadLetteredResponseDTO } from './get-consumer-dead-lettered.response.DTO';
import { ConsumerTimeSeriesService } from '../../../../../../services/consumer-time-series.service';
import { registry } from '../../../../../../lib/registry';

export const GetConsumerDeadLetteredHandler: TRouteControllerActionHandler<
  GetConsumerDeadLetteredRequestDTO,
  GetConsumerDeadLetteredResponseDTO
> = () => {
  return async (ctx) => {
    return (await ConsumerTimeSeriesService.getInstance(registry)).deadLettered(
      ctx.state.dto,
    );
  };
};
