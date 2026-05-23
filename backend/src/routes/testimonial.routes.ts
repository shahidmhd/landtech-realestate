import { Router } from 'express';
import { TestimonialModel } from '@/models/Testimonial';
import { catchAsync } from '@/utils/catchAsync';
import { notFound } from '@/utils/AppError';
import { protect, restrictTo } from '@/middleware/auth';

const router = Router();

router.get('/', catchAsync(async (_req, res) => {
  const items = await TestimonialModel.find({ published: true }).sort({ order: 1, createdAt: -1 }).lean();
  res.json({ status: 'success', data: items });
}));

router.use(protect, restrictTo('admin', 'editor'));

router.post('/', catchAsync(async (req, res) => {
  const created = await TestimonialModel.create(req.body);
  res.status(201).json({ status: 'success', data: created });
}));

router.patch('/:id', catchAsync(async (req, res) => {
  const updated = await TestimonialModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) throw notFound('Testimonial');
  res.json({ status: 'success', data: updated });
}));

router.delete('/:id', catchAsync(async (req, res) => {
  const deleted = await TestimonialModel.findByIdAndDelete(req.params.id);
  if (!deleted) throw notFound('Testimonial');
  res.status(204).end();
}));

export default router;
