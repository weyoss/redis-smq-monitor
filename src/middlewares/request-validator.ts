import { ClassConstructor } from 'class-transformer';
import { validateDTO } from '../common/validate-dto';
import { ERouteControllerActionPayload, TMiddleware } from '../common/routing';

export function RequestValidator(
  dto: ClassConstructor<any>,
  payload: ERouteControllerActionPayload[],
): TMiddleware {
  return async (ctx, next) => {
    let plain: Record<string, any> = {};
    payload.forEach((i) => {
      if (i === ERouteControllerActionPayload.PATH) {
        plain = {
          ...plain,
          ...ctx.params,
        };
      } else if (i === ERouteControllerActionPayload.QUERY) {
        plain = {
          ...plain,
          ...ctx.query,
        };
      } else if (i === ERouteControllerActionPayload.BODY) {
        const body: Record<string | number, any> =
          typeof ctx.request['body'] === 'object' ? ctx.request['body'] : {};
        plain = {
          ...plain,
          ...body,
        };
      }
    });
    ctx.state.dto = await validateDTO(dto, plain);
    await next();
  };
}
