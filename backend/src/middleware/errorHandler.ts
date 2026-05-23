import type { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/AppError';
import { logger } from '@/utils/logger';
import { isProd } from '@/config/env';

interface MongooseError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
  path?: string;
  value?: unknown;
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(`Cannot ${req.method} ${req.originalUrl}`, 404));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  let appErr: AppError;

  if (err instanceof AppError) {
    appErr = err;
  } else {
    const e = err as MongooseError;
    if (e.name === 'CastError') {
      appErr = new AppError(`Invalid ${e.path}: ${String(e.value)}`, 400);
    } else if (e.code === 11000 && e.keyValue) {
      const field = Object.keys(e.keyValue)[0];
      appErr = new AppError(`Duplicate value for ${field}`, 409);
    } else if (e.name === 'ValidationError' && e.errors) {
      const msg = Object.values(e.errors).map((v) => v.message).join('; ');
      appErr = new AppError(`Validation failed: ${msg}`, 400);
    } else if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {
      appErr = new AppError('Invalid or expired token', 401);
    } else {
      appErr = new AppError('Something went wrong', 500);
    }
  }

  if (appErr.statusCode >= 500) {
    logger.error({ err, path: _req.originalUrl }, 'Unhandled error');
  }

  res.status(appErr.statusCode).json({
    status: appErr.status,
    message: appErr.message,
    ...(isProd ? {} : { stack: err.stack }),
  });
}
