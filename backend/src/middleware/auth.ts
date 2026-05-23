import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@/config/env';
import { UserModel } from '@/models/User';
import { AppError } from '@/utils/AppError';
import { catchAsync } from '@/utils/catchAsync';

type Role = 'admin' | 'editor' | 'broker' | 'user';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
        email: string;
        name: string;
      };
    }
  }
}

interface JwtPayload {
  id: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export function signAccessToken(payload: Pick<JwtPayload, 'id' | 'role'>) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
}

export function signRefreshToken(payload: Pick<JwtPayload, 'id' | 'role'>) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions);
}

export const protect = catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new AppError('You are not logged in', 401);

  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }

  const user = await UserModel.findById(decoded.id).lean();
  if (!user || !user.active) throw new AppError('User no longer exists', 401);

  req.user = {
    id: String(user._id),
    role: user.role as Role,
    email: user.email,
    name: user.name,
  };
  next();
});

export const restrictTo = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Insufficient permissions', 403));
    }
    next();
  };
};
