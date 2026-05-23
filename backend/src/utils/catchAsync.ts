import type { Request, Response, NextFunction, RequestHandler } from 'express';

type Async = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export const catchAsync = (fn: Async): RequestHandler => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
