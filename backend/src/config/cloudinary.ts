import { v2 as cloudinary, type UploadApiOptions, type UploadApiResponse } from 'cloudinary';
import multer from 'multer';
import { Readable } from 'stream';
import { env } from './env';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * In-memory multer — buffers files for piping to Cloudinary.
 * Keeps the request stream lean and the integration on the modern v2 SDK
 * (the unmaintained `multer-storage-cloudinary` package is pinned to v1).
 */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req, file, cb) => {
    if (/^(image|video)\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image and video files are allowed'));
  },
});

/**
 * Pipe a buffered upload to Cloudinary using `upload_stream`.
 * Returns the raw Cloudinary response (secure_url, public_id, etc).
 */
export function uploadBufferToCloudinary(
  buffer: Buffer,
  options: UploadApiOptions = {}
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) {
        return reject(error ?? new Error('Cloudinary upload failed'));
      }
      resolve(result);
    });
    Readable.from(buffer).pipe(stream);
  });
}

export { cloudinary };
