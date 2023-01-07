import { TRouteControllerActionHandler } from '../../../../common/routing';
import { QueuesService } from '../../../../services/queues.service';
import { registry } from '../../../../lib/registry';
import { SaveQueueRequestDTO } from './save-queue.request.DTO';
import { SaveQueueResponseDTO } from './save-queue.response.DTO';

export const SaveQueueHandler: TRouteControllerActionHandler<
  SaveQueueRequestDTO,
  SaveQueueResponseDTO
> = () => async (ctx) => {
  return (await QueuesService.getInstance(registry)).saveQueue(ctx.state.dto);
};
