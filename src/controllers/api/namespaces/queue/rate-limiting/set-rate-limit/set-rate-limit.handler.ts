import { TRouteControllerActionHandler } from '../../../../../../common/routing';
import { SetRateLimitRequestDTO } from './set-rate-limit.request.DTO';
import { SetRateLimitResponseDTO } from './set-rate-limit.response.DTO';
import { QueuesService } from '../../../../../../services/queues.service';
import { registry } from '../../../../../../lib/registry';

export const SetRateLimitHandler: TRouteControllerActionHandler<
  SetRateLimitRequestDTO,
  SetRateLimitResponseDTO
> = () => {
  return async (ctx) => {
    return (await QueuesService.getInstance(registry)).setQueueRateLimit(
      ctx.state.dto,
    );
  };
};
