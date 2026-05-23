import { Router } from 'express';
import { createInquiry, createInquirySchema, listInquiries, updateInquiry } from '@/controllers/inquiry.controller';
import { validate } from '@/middleware/validate';
import { protect, restrictTo } from '@/middleware/auth';

const router = Router();

router.post('/', validate(createInquirySchema), createInquiry);

router.use(protect, restrictTo('admin', 'editor', 'broker'));
router.get('/', listInquiries);
router.patch('/:id', updateInquiry);

export default router;
