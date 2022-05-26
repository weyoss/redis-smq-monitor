import { TRouteControllerActionHandler } from '../../../../../../common/routing';
import { GetConsumerAcknowledgedRequestDTO } from './get-consumer-acknowledged.request.DTO';
import { GetConsumerAcknowledgedResponseDTO } from './get-consumer-acknowledged.response.DTO';
import { ConsumerTimeSeriesService } from '../../../../../../services/consumer-time-series.service';
import { registry } from '../../../../../../lib/registry';

export const GetConsumerAcknowledgedHandler: TRouteControllerActionHandler<
  GetConsumerAcknowledgedRequestDTO,
  GetConsumerAcknowledgedResponseDTO
> = () => {
  return async (ctx) => {
    return (await ConsumerTimeSeriesService.getInstance(registry)).acknowledged(
      ctx.state.dto,
    );
  };
};
