import { Router } from 'express';
import { upload, cloudinary, uploadBufferToCloudinary } from '@/config/cloudinary';
import { protect, restrictTo } from '@/middleware/auth';
import { catchAsync } from '@/utils/catchAsync';
import { AppError } from '@/utils/AppError';

const router = Router();

router.use(protect, restrictTo('admin', 'editor'));

router.post('/', upload.array('files', 20), catchAsync(async (req, res) => {
  const files = (req.files as Express.Multer.File[]) || [];
  if (!files.length) throw new AppError('No files received', 400);

  const uploaded = await Promise.all(
    files.map(async (f) => {
      const isVideo = f.mimetype.startsWith('video');
      const result = await uploadBufferToCloudinary(f.buffer, {
        folder: 'luxe-estates',
        resource_type: isVideo ? 'video' : 'image',
        ...(isVideo
          ? {}
          : {
              format: 'webp',
              transformation: [{ quality: 'auto:best', fetch_format: 'auto' }],
            }),
      });
      return {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        mimetype: f.mimetype,
      };
    })
  );

  res.status(201).json({ status: 'success', data: uploaded });
}));

router.delete('/:publicId', catchAsync(async (req, res) => {
  const publicId = decodeURIComponent(req.params.publicId);
  await cloudinary.uploader.destroy(publicId, { invalidate: true });
  res.status(204).end();
}));

export default router;
