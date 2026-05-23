import { Router } from 'express';
import propertyRoutes from './property.routes';
import authRoutes from './auth.routes';
import inquiryRoutes from './inquiry.routes';
import blogRoutes from './blog.routes';
import uploadRoutes from './upload.routes';
import settingsRoutes from './settings.routes';
import testimonialRoutes from './testimonial.routes';
import newsletterRoutes from './newsletter.routes';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/blog', blogRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/settings', settingsRoutes);
router.use('/uploads', uploadRoutes);

export default router;
