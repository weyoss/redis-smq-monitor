import { TRouteControllerActionHandler } from '../../../../common/routing';
import { GetNamespaceQueuesRequestDTO } from './get-namespace-queues.request.DTO';
import { GetNamespaceQueuesResponseDTO } from './get-namespace-queues.response.DTO';
import { QueuesService } from '../../../../services/queues.service';
import { registry } from '../../../../lib/registry';

export const GetNamespaceQueuesHandler: TRouteControllerActionHandler<
  GetNamespaceQueuesRequestDTO,
  GetNamespaceQueuesResponseDTO
> = () => {
  return async (ctx) => {
    return (await QueuesService.getInstance(registry)).getNamespaceQueues(
      ctx.state.dto,
    );
  };
};
