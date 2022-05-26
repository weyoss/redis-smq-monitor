import { ValidationError } from 'class-validator';
import { registry } from '../lib/registry';
import { TMiddleware } from '../common/routing';

export const errorHandler: TMiddleware = async (ctx, next) => {
  try {
    await next();
  } catch (e: unknown) {
    registry.getItem('logger').error(JSON.stringify(e));
    ctx.status = e instanceof ValidationError ? 422 : 500;
    ctx.body = {
      error: {
        code: ctx.status,
        message:
          (e instanceof ValidationError && 'Validation error') ||
          (e instanceof Error && e.message) ||
          'Internal server error',
        details:
          (e instanceof ValidationError && e) ||
          (e instanceof Error && {
            message: e.message,
            name: e.name,
            stack: e.stack,
          }) ||
          {},
      },
    };
  }
};
