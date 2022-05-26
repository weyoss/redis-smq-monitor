import {
  ERouteControllerActionMethod,
  IRouteController,
} from '../../../common/routing';
import { GetQueuesHandler } from './get-queues/get-queues.handler';
import { GetQueuesRequestDTO } from './get-queues/get-queues.request.DTO';
import { GetQueuesResponseDTO } from './get-queues/get-queues.response.DTO';

export const queuesController: IRouteController = {
  path: '/queues',
  actions: [
    {
      path: '/',
      method: ERouteControllerActionMethod.GET,
      payload: [],
      Handler: GetQueuesHandler,
      RequestDTO: GetQueuesRequestDTO,
      ResponseDTO: GetQueuesResponseDTO,
    },
  ],
};
