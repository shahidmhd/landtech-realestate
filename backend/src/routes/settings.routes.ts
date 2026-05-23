import { Router } from 'express';
import { SettingsModel } from '@/models/Settings';
import { catchAsync } from '@/utils/catchAsync';
import { protect, restrictTo } from '@/middleware/auth';

const router = Router();

router.get('/', catchAsync(async (_req, res) => {
  const settings = await SettingsModel.findOne({ key: 'global' }).lean() || {};
  res.json({ status: 'success', data: settings });
}));

router.put('/', protect, restrictTo('admin'), catchAsync(async (req, res) => {
  const updated = await SettingsModel.findOneAndUpdate(
    { key: 'global' },
    { ...req.body, key: 'global' },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).lean();
  res.json({ status: 'success', data: updated });
}));

export default router;
