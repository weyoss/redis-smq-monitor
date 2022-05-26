import { TRouteControllerActionHandler } from '../../../../common/routing';
import { GetNamespacesRequestDTO } from './get-namespaces.request.DTO';
import { GetNamespacesResponseDTO } from './get-namespaces.response.DTO';
import { QueuesService } from '../../../../services/queues.service';
import { registry } from '../../../../lib/registry';

export const GetNamespacesHandler: TRouteControllerActionHandler<
  GetNamespacesRequestDTO,
  GetNamespacesResponseDTO
> = () => {
  return async () => {
    return (await QueuesService.getInstance(registry)).getNamespaces();
  };
};
