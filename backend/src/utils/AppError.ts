export class AppError extends Error {
  statusCode: number;
  status: 'fail' | 'error';
  isOperational = true;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const notFound = (resource = 'Resource') =>
  new AppError(`${resource} not found`, 404);
