import { TRouteControllerActionHandler } from '../../../../../common/routing';
import { DeleteQueueRequestDTO } from './delete-queue.request.DTO';
import { DeleteQueueResponseDTO } from './delete-queue.response.DTO';
import { QueuesService } from '../../../../../services/queues.service';
import { registry } from '../../../../../lib/registry';

export const DeleteQueueHandler: TRouteControllerActionHandler<
  DeleteQueueRequestDTO,
  DeleteQueueResponseDTO
> = () => {
  return async (ctx) => {
    return (await QueuesService.getInstance(registry)).deleteQueue(
      ctx.state.dto,
    );
  };
};
