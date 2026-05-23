import { Router } from 'express';
import { BlogModel } from '@/models/Blog';
import { catchAsync } from '@/utils/catchAsync';
import { notFound } from '@/utils/AppError';
import { protect, restrictTo } from '@/middleware/auth';

const router = Router();

router.get('/', catchAsync(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(40, Math.max(1, Number(req.query.limit) || 12));
  const filter: Record<string, unknown> = { published: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.tag) filter.tags = req.query.tag;

  const [items, total] = await Promise.all([
    BlogModel.find(filter).sort({ publishedAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    BlogModel.countDocuments(filter),
  ]);
  res.json({ status: 'success', data: items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}));

router.get('/:slug', catchAsync(async (req, res) => {
  const post = await BlogModel.findOneAndUpdate(
    { slug: req.params.slug, published: true },
    { $inc: { views: 1 } },
    { new: true }
  ).lean();
  if (!post) throw notFound('Article');

  const related = await BlogModel.find({
    _id: { $ne: post._id },
    category: post.category,
    published: true,
  }).sort({ publishedAt: -1 }).limit(3).lean();

  res.json({ status: 'success', data: post, related });
}));

router.use(protect, restrictTo('admin', 'editor'));

router.post('/', catchAsync(async (req, res) => {
  const created = await BlogModel.create(req.body);
  res.status(201).json({ status: 'success', data: created });
}));

router.patch('/:id', catchAsync(async (req, res) => {
  const updated = await BlogModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updated) throw notFound('Article');
  res.json({ status: 'success', data: updated });
}));

router.delete('/:id', catchAsync(async (req, res) => {
  const deleted = await BlogModel.findByIdAndDelete(req.params.id);
  if (!deleted) throw notFound('Article');
  res.status(204).end();
}));

export default router;
