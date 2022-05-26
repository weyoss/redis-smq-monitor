import { ClassConstructor } from 'class-transformer';
import { validateDTO } from '../common/validate-dto';
import { TMiddleware } from '../common/routing';

export function ResponseValidator(
  dto: ClassConstructor<Record<any, any>>,
): TMiddleware {
  return async (ctx, next) => {
    const context = await validateDTO(dto, {
      status: ctx.status,
      body: ctx.body,
    });
    Object.assign(ctx, context);
    await next();
  };
}
