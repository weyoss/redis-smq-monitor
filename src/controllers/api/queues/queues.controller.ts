import {
  ERouteControllerActionMethod,
  ERouteControllerActionPayload,
  IRouteController,
} from '../../../common/routing';
import { GetQueuesHandler } from './get-queues/get-queues.handler';
import { GetQueuesRequestDTO } from './get-queues/get-queues.request.DTO';
import { GetQueuesResponseDTO } from './get-queues/get-queues.response.DTO';
import { CreateQueueHandler } from './create-queue/create-queue.handler';
import { CreateQueueRequestDTO } from './create-queue/create-queue.request.DTO';
import { CreateQueueResponseDTO } from './create-queue/create-queue.response.DTO';

export const queuesController: IRouteController = {
  path: '/queues',
  actions: [
    {
      path: '/',
      method: ERouteControllerActionMethod.POST,
      payload: [ERouteControllerActionPayload.BODY],
      Handler: CreateQueueHandler,
      RequestDTO: CreateQueueRequestDTO,
      ResponseDTO: CreateQueueResponseDTO,
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
