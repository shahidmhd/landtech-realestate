import { createApp } from './app';
import { connectDb, disconnectDb } from '@/config/db';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';

async function bootstrap() {
  await connectDb();
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`✓ API listening on http://localhost:${env.PORT}${env.API_PREFIX}`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down`);
    server.close(async () => {
      await disconnectDb();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('uncaughtException', (err) => {
    logger.error({ err }, 'uncaughtException');
    shutdown('uncaughtException');
  });
  process.on('unhandledRejection', (reason) => {
    logger.error({ reason }, 'unhandledRejection');
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', err);
  process.exit(1);
});
