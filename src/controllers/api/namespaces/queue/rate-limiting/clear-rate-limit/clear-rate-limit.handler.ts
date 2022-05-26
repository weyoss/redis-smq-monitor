import { TRouteControllerActionHandler } from '../../../../../../common/routing';
import { ClearRateLimitRequestDTO } from './clear-rate-limit.request.DTO';
import { ClearRateLimitResponseDTO } from './clear-rate-limit.response.DTO';
import { QueuesService } from '../../../../../../services/queues.service';
import { registry } from '../../../../../../lib/registry';

export const ClearRateLimitHandler: TRouteControllerActionHandler<
  ClearRateLimitRequestDTO,
  ClearRateLimitResponseDTO
> = () => {
  return async (ctx) => {
    return (await QueuesService.getInstance(registry)).clearQueueRateLimit(
      ctx.state.dto,
    );
  };
};
