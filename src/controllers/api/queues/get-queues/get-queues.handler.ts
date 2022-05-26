import { GetQueuesRequestDTO } from './get-queues.request.DTO';
import { TRouteControllerActionHandler } from '../../../../common/routing';
import { GetQueuesResponseDTO } from './get-queues.response.DTO';
import { QueuesService } from '../../../../services/queues.service';
import { registry } from '../../../../lib/registry';

export const GetQueuesHandler: TRouteControllerActionHandler<
  GetQueuesRequestDTO,
  GetQueuesResponseDTO
> = () => async () => {
  return (await QueuesService.getInstance(registry)).getQueues();
};
