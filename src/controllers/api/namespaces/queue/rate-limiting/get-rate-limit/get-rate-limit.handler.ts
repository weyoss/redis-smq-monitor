import { TRouteControllerActionHandler } from '../../../../../../common/routing';
import { GetRateLimitRequestDTO } from './get-rate-limit.request.DTO';
import { GetRateLimitResponseDTO } from './get-rate-limit.response.DTO';
import { QueuesService } from '../../../../../../services/queues.service';
import { registry } from '../../../../../../lib/registry';

export const GetRateLimitHandler: TRouteControllerActionHandler<
  GetRateLimitRequestDTO,
  GetRateLimitResponseDTO
> = () => {
  return async (ctx) => {
    return (await QueuesService.getInstance(registry)).getQueueRateLimit(
      ctx.state.dto,
    );
  };
};
