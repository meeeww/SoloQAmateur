import { Context, Next } from 'hono';
import {
  ValidationError,
  DuplicateEntryError,
  PrimaryKeyEntryError,
  ForeignKeyEntryError,
  BadRequestError,
  MethodNotAllowedError,
  UnsupportedMediaTypeError,
  RateLimitExceededError,
  InternalServerError,
  BadGatewayError,
  ServiceUnavailableError,
  GatewayTimeoutError,
  NotFoundError,
} from '../middlewares/appError';
import { resultHandler } from '../middlewares/resultHandler';

export const errorHandler = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    if (
      error instanceof ValidationError ||
      error instanceof NotFoundError ||
      error instanceof DuplicateEntryError ||
      error instanceof PrimaryKeyEntryError ||
      error instanceof ForeignKeyEntryError ||
      error instanceof BadRequestError ||
      error instanceof MethodNotAllowedError ||
      error instanceof UnsupportedMediaTypeError ||
      error instanceof RateLimitExceededError ||
      error instanceof InternalServerError ||
      error instanceof BadGatewayError ||
      error instanceof ServiceUnavailableError ||
      error instanceof GatewayTimeoutError
    ) {
      return resultHandler(
        {
          status: error.statusCode,
          success: false,
          result: error.message,
        },
        c,
      );
    }

    // Error genérico si no coincide con ninguna clase específica
    return resultHandler(
      {
        status: 500,
        success: false,
        result: 'Error interno del servidor',
      },
      c,
    );
  }
};
