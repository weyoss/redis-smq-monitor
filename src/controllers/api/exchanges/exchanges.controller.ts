import {
  ERouteControllerActionMethod,
  ERouteControllerActionPayload,
  IRouteController,
} from '../../../common/routing';
import { GetExchangesHandler } from './get-exchanges/get-exchanges.handler';
import { GetExchangesRequestDTO } from './get-exchanges/get-exchanges.request.DTO';
import { GetExchangesResponseDTO } from './get-exchanges/get-exchanges.response.DTO';
import { GetExchangeQueuesHandler } from './get-exchange-queues/get-exchange-queues.handler';
import { GetExchangeQueuesRequestDTO } from './get-exchange-queues/get-exchange-queues.request.DTO';
import { GetExchangeQueuesResponseDTO } from './get-exchange-queues/get-exchange-queues.response.DTO';
import { BindQueueHandler } from './bind-queue/bind-queue.handler';
import { BindQueueRequestDTO } from './bind-queue/bind-queue.request.DTO';
import { BindQueueResponseDTO } from './bind-queue/bind-queue.response.DTO';
import { UnbindQueueHandler } from './unbind-queue/unbind-queue.handler';
import { UnbindQueueRequestDTO } from './unbind-queue/unbind-queue.request.DTO';
import { UnbindQueueResponseDTO } from './unbind-queue/unbind-queue.response.DTO';
import { CreateExchangeHandler } from './create-exchange/create-exchange.handler';
import { CreateExchangeRequestDTO } from './create-exchange/create-exchange.request.DTO';
import { CreateExchangeResponseDTO } from './create-exchange/create-exchange.response.DTO';
import { DeleteExchangeHandler } from './delete-exchange/delete-exchange.handler';
import { DeleteExchangeRequestDTO } from './delete-exchange/delete-exchange.request.DTO';
import { DeleteExchangeResponseDTO } from './delete-exchange/delete-exchange.response.DTO';

export const exchangesController: IRouteController = {
  path: '/exchanges',
  actions: [
    {
      path: '/',
      method: ERouteControllerActionMethod.GET,
      payload: [],
      Handler: GetExchangesHandler,
      RequestDTO: GetExchangesRequestDTO,
      ResponseDTO: GetExchangesResponseDTO,
    },
    {
      path: '/',
      method: ERouteControllerActionMethod.POST,
      payload: [ERouteControllerActionPayload.BODY],
      Handler: CreateExchangeHandler,
      RequestDTO: CreateExchangeRequestDTO,
      ResponseDTO: CreateExchangeResponseDTO,
    },
    {
      path: '/:exchangeName',
      actions: [
        {
          path: '/',
          method: ERouteControllerActionMethod.DELETE,
          payload: [ERouteControllerActionPayload.PATH],
          Handler: DeleteExchangeHandler,
          RequestDTO: DeleteExchangeRequestDTO,
          ResponseDTO: DeleteExchangeResponseDTO,
        },
        {
          path: '/queues',
          method: ERouteControllerActionMethod.GET,
          payload: [ERouteControllerActionPayload.PATH],
          Handler: GetExchangeQueuesHandler,
          RequestDTO: GetExchangeQueuesRequestDTO,
          ResponseDTO: GetExchangeQueuesResponseDTO,
        },
        {
          path: '/bind',
          method: ERouteControllerActionMethod.POST,
          payload: [
            ERouteControllerActionPayload.PATH,
            ERouteControllerActionPayload.BODY,
          ],
          Handler: BindQueueHandler,
          RequestDTO: BindQueueRequestDTO,
          ResponseDTO: BindQueueResponseDTO,
        },
        {
          path: '/unbind',
          method: ERouteControllerActionMethod.POST,
          payload: [
            ERouteControllerActionPayload.PATH,
            ERouteControllerActionPayload.BODY,
          ],
          Handler: UnbindQueueHandler,
          RequestDTO: UnbindQueueRequestDTO,
          ResponseDTO: UnbindQueueResponseDTO,
        },
      ],
    },
  ],
};
