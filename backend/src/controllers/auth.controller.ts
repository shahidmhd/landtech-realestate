import { z } from 'zod';
import { UserModel } from '@/models/User';
import { signAccessToken, signRefreshToken } from '@/middleware/auth';
import { AppError } from '@/utils/AppError';
import { catchAsync } from '@/utils/catchAsync';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    phone: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

function authResponse(user: { id: string; role: 'admin' | 'editor' | 'broker' | 'user' }) {
  return {
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
  };
}

export const register = catchAsync(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const exists = await UserModel.findOne({ email });
  if (exists) throw new AppError('Email already registered', 409);

  const user = await UserModel.create({ name, email, password, phone });
  const tokens = authResponse({ id: String(user._id), role: user.role });
  res.status(201).json({
    status: 'success',
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    ...tokens,
  });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Incorrect email or password', 401);
  }
  user.lastLoginAt = new Date();
  await user.save({ validateBeforeSave: false });

  const tokens = authResponse({ id: String(user._id), role: user.role });
  res.json({
    status: 'success',
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    ...tokens,
  });
});

export const me = catchAsync(async (req, res) => {
  res.json({ status: 'success', user: req.user });
});
