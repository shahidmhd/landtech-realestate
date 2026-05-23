import { Router } from 'express';
import { z } from 'zod';
import { InquiryModel } from '@/models/Inquiry';
import { catchAsync } from '@/utils/catchAsync';
import { validate } from '@/middleware/validate';

const router = Router();

const subscribeSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().optional(),
  }),
});

router.post('/', validate(subscribeSchema), catchAsync(async (req, res) => {
  const { email, name } = req.body;
  await InquiryModel.create({
    name: name || email.split('@')[0],
    email,
    source: 'newsletter',
    status: 'new',
  });
  res.status(201).json({ status: 'success' });
}));

export default router;
