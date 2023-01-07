import {
  ERouteControllerActionMethod,
  ERouteControllerActionPayload,
  IRouteController,
} from '../../../common/routing';
import { GetQueuesHandler } from './get-queues/get-queues.handler';
import { GetQueuesRequestDTO } from './get-queues/get-queues.request.DTO';
import { GetQueuesResponseDTO } from './get-queues/get-queues.response.DTO';
import { SaveQueueHandler } from './save-queue/save-queue.handler';
import { SaveQueueRequestDTO } from './save-queue/save-queue.request.DTO';
import { SaveQueueResponseDTO } from './save-queue/save-queue.response.DTO';

export const queuesController: IRouteController = {
  path: '/queues',
  actions: [
    {
      path: '/',
      method: ERouteControllerActionMethod.POST,
      payload: [ERouteControllerActionPayload.BODY],
      Handler: SaveQueueHandler,
      RequestDTO: SaveQueueRequestDTO,
      ResponseDTO: SaveQueueResponseDTO,
    },
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
