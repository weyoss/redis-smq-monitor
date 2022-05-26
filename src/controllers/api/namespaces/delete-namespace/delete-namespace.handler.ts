import { TRouteControllerActionHandler } from '../../../../common/routing';
import { DeleteNamespaceRequestDTO } from './delete-namespace.request.DTO';
import { DeleteNamespaceResponseDTO } from './delete-namespace.response.DTO';
import { QueuesService } from '../../../../services/queues.service';
import { registry } from '../../../../lib/registry';

export const DeleteNamespaceHandler: TRouteControllerActionHandler<
  DeleteNamespaceRequestDTO,
  DeleteNamespaceResponseDTO
> = () => {
  return async (ctx) => {
    return (await QueuesService.getInstance(registry)).deleteNamespace(
      ctx.state.dto,
    );
  };
};
