import { Router } from 'express';
import {
  listProperties,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty,
  featuredProperties,
} from '@/controllers/property.controller';
import { protect, restrictTo } from '@/middleware/auth';

const router = Router();

router.get('/', listProperties);
router.get('/featured', featuredProperties);
router.get('/:slug', getPropertyBySlug);

router.use(protect, restrictTo('admin', 'editor'));
router.post('/', createProperty);
router.patch('/:id', updateProperty);
router.delete('/:id', deleteProperty);

export default router;
