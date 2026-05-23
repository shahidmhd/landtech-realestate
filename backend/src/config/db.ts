import mongoose from 'mongoose';
import { env, isProd } from './env';
import { logger } from '@/utils/logger';

mongoose.set('strictQuery', true);

export async function connectDb(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      autoIndex: !isProd,
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 8000,
    });
    logger.info(`✓ MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    logger.error({ err }, 'MongoDB connection failed');
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () =>
    logger.warn('MongoDB disconnected')
  );
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}
