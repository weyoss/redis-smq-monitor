import * as Router from '@koa/router';
import { ClassConstructor } from 'class-transformer';
import { RequestValidator } from '../middlewares/request-validator';
import { ResponseValidator } from '../middlewares/response-validator';
import { posix } from 'path';
import * as Koa from 'koa';

export enum ERouteControllerActionPayload {
  QUERY = 'query',
  BODY = 'body',
  PATH = 'path',
}

export enum ERouteControllerActionMethod {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
}

export interface IResponseBodyError {
  code: number;
  message: string;
  details?: Record<string, any>;
}

export interface IResponseBody<Data = Record<string, any>> {
  data?: Data;
  error?: IResponseBodyError;
}

export interface IContextState<DTO> extends Koa.DefaultState {
  dto: DTO;
}

export type TMiddleware<DTO = Record<string, any>> = Koa.Middleware<
  IContextState<DTO>,
  Koa.DefaultContext & { params: Record<string, string> },
  IResponseBody
>;

export type TRequestContext<
  RequestDTO,
  ResponseDTO extends TResponseDTO,
> = Koa.ParameterizedContext<
  IContextState<RequestDTO>,
  Koa.DefaultContext,
  ResponseDTO['body']
>;

export type TResponseDTO<Body = any> = {
  status: number;
  body: IResponseBody<Body> | void;
};

export type TRequestDTO = Record<string, any>;

export type TRouteControllerActionHandler<
  RequestDTO extends TRequestDTO,
  ResponseDTO extends TResponseDTO,
> = (
  app: Koa,
) => (
  ctx: TRequestContext<RequestDTO, ResponseDTO>,
) => Promise<
  ResponseDTO['body'] extends Record<any, any>
    ? ResponseDTO['body']['data']
    : void
>;

export type TRouteControllerAction<
  RequestDTO extends TRequestDTO,
  ResponseDTO extends TResponseDTO,
> = {
  path: string;
  method: ERouteControllerActionMethod;
  payload: ERouteControllerActionPayload[];
  Handler: TRouteControllerActionHandler<RequestDTO, ResponseDTO>;
  RequestDTO: ClassConstructor<any>;
  ResponseDTO: ClassConstructor<any>;
};

export interface IRouteController {
  path: string;
  actions: (IRouteController | TRouteControllerAction<any, any>)[];
}

function isRouteController(
  object: IRouteController | TRouteControllerAction<any, any>,
): object is IRouteController {
  return object.hasOwnProperty('actions');
}

export function getControllerActionRouter<
  RequestDTO extends TRequestDTO,
  ResponseDTO extends TResponseDTO,
>(app: Koa, action: TRouteControllerAction<RequestDTO, ResponseDTO>): Router {
  const router = new Router();
  router[action.method](
    action.path,
    RequestValidator(action.RequestDTO, action.payload),
    async (ctx: TRequestContext<RequestDTO, ResponseDTO>, next: Koa.Next) => {
      const data = await action.Handler(app)(ctx);
      if (data !== undefined) {
        ctx.status = 200;
        ctx.body = { data };
      } else {
        ctx.status = 204;
        ctx.body = undefined;
      }
      await next();
    },
    ResponseValidator(action.ResponseDTO),
  );
  return router;
}

export function registerControllerRoutes(
  app: Koa,
  controller: IRouteController,
  mainRouter: Router,
  path = '/',
): void {
  for (const item of controller.actions) {
    if (isRouteController(item)) {
      registerControllerRoutes(
        app,
        item,
        mainRouter,
        item.path === '/' ? path : posix.join(path, item.path),
      );
    } else {
      const router = getControllerActionRouter(app, item);
      mainRouter.use(path, router.routes());
    }
  }
}

export function getApplicationRouter(
  app: Koa,
  controllers: IRouteController[],
): Router {
  const applicationRouter = new Router();
  for (const controller of controllers) {
    registerControllerRoutes(
      app,
      controller,
      applicationRouter,
      controller.path,
    );
  }
  return applicationRouter;
}
