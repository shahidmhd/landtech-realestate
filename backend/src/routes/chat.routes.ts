import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { chat, chatRequestSchema } from '@/controllers/chat.controller';
import { validate } from '@/middleware/validate';

const router = Router();

// Tighter per-IP cap on top of the global API rate limit — chat is expensive.
// 20 messages per 5 minutes is enough for any real visitor but slows abuse.
const chatLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'fail', message: 'Too many messages — try again in a few minutes.' },
});

router.post('/', chatLimiter, validate(chatRequestSchema), chat);

export default router;
