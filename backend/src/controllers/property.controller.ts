import type { Request, Response } from 'express';
import { PropertyModel } from '@/models/Property';
import { catchAsync } from '@/utils/catchAsync';
import { notFound } from '@/utils/AppError';

interface PropertyQuery {
  q?: string;
  location?: string;
  category?: string;
  status?: string;
  beds?: string;
  baths?: string;
  priceMin?: string;
  priceMax?: string;
  featured?: string;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
  page?: string;
  limit?: string;
}

export const listProperties = catchAsync(async (req: Request, res: Response) => {
  const q = req.query as PropertyQuery;
  const page = Math.max(1, Number(q.page) || 1);
  const limit = Math.min(60, Math.max(1, Number(q.limit) || 12));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = { published: true };
  if (q.q) filter.$text = { $search: q.q };
  if (q.location) filter.location = new RegExp(q.location, 'i');
  if (q.category) filter.category = q.category;
  if (q.status) filter.status = q.status;
  if (q.beds) filter.bedrooms = { $gte: Number(q.beds) };
  if (q.baths) filter.bathrooms = { $gte: Number(q.baths) };
  if (q.priceMin || q.priceMax) {
    filter.price = {
      ...(q.priceMin ? { $gte: Number(q.priceMin) } : {}),
      ...(q.priceMax ? { $lte: Number(q.priceMax) } : {}),
    };
  }
  if (q.featured === 'true') filter.featured = true;

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    popular: { views: -1 },
  };

  const [items, total] = await Promise.all([
    PropertyModel.find(filter)
      .sort(sortMap[q.sort || 'newest'])
      .skip(skip)
      .limit(limit)
      .lean(),
    PropertyModel.countDocuments(filter),
  ]);

  res.json({
    status: 'success',
    data: items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getPropertyBySlug = catchAsync(async (req, res) => {
  const property = await PropertyModel.findOneAndUpdate(
    { slug: req.params.slug, published: true },
    { $inc: { views: 1 } },
    { new: true }
  ).lean();
  if (!property) throw notFound('Property');

  const similar = await PropertyModel.find({
    _id: { $ne: property._id },
    category: property.category,
    published: true,
  })
    .sort({ featured: -1, createdAt: -1 })
    .limit(4)
    .lean();

  res.json({ status: 'success', data: property, similar });
});

export const createProperty = catchAsync(async (req, res) => {
  const created = await PropertyModel.create(req.body);
  res.status(201).json({ status: 'success', data: created });
});

export const updateProperty = catchAsync(async (req, res) => {
  const updated = await PropertyModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updated) throw notFound('Property');
  res.json({ status: 'success', data: updated });
});

export const deleteProperty = catchAsync(async (req, res) => {
  const deleted = await PropertyModel.findByIdAndDelete(req.params.id);
  if (!deleted) throw notFound('Property');
  res.status(204).end();
});

export const featuredProperties = catchAsync(async (_req, res) => {
  const items = await PropertyModel.find({ featured: true, published: true })
    .sort({ updatedAt: -1 })
    .limit(8)
    .lean();
  res.json({ status: 'success', data: items });
});
