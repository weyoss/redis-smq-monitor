import { TRouteControllerActionHandler } from '../../../../common/routing';
import { QueuesService } from '../../../../services/queues.service';
import { registry } from '../../../../lib/registry';
import { CreateQueueRequestDTO } from './create-queue.request.DTO';
import { CreateQueueResponseDTO } from './create-queue.response.DTO';

export const CreateQueueHandler: TRouteControllerActionHandler<
  CreateQueueRequestDTO,
  CreateQueueResponseDTO
> = () => async (ctx) => {
  return (await QueuesService.getInstance(registry)).createQueue(ctx.state.dto);
};
