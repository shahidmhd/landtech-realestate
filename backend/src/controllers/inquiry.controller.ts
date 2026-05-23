import { z } from 'zod';
import { InquiryModel } from '@/models/Inquiry';
import { catchAsync } from '@/utils/catchAsync';
import { notFound } from '@/utils/AppError';
import { sendLeadNotification } from '@/utils/mailer';

export const createInquirySchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(5).optional(),
    message: z.string().max(2000).optional(),
    propertyId: z.string().optional(),
    propertySlug: z.string().optional(),
    source: z.enum(['contact', 'property', 'newsletter', 'consultation']).optional(),
  }),
});

export const createInquiry = catchAsync(async (req, res) => {
  const inquiry = await InquiryModel.create(req.body);
  // fire-and-forget
  sendLeadNotification(inquiry).catch(() => null);
  res.status(201).json({ status: 'success', data: { id: inquiry._id } });
});

export const listInquiries = catchAsync(async (req, res) => {
  const status = req.query.status as string | undefined;
  const filter = status ? { status } : {};
  const items = await InquiryModel.find(filter).sort({ createdAt: -1 }).limit(200).lean();
  res.json({ status: 'success', data: items });
});

export const updateInquiry = catchAsync(async (req, res) => {
  const updated = await InquiryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) throw notFound('Inquiry');
  res.json({ status: 'success', data: updated });
});
