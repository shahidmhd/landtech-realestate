import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
// @ts-expect-error — xss-clean has no types
import xss from 'xss-clean';
import { env, corsOrigins, isProd } from '@/config/env';
import routes from '@/routes';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

export function createApp(): Express {
  const app = express();

  app.set('trust proxy', 1);

  // security
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: isProd ? undefined : false,
  }));
  app.use(cors({
    origin: (origin, cb) => {
      if (!origin || corsOrigins.includes(origin) || corsOrigins.includes('*')) cb(null, true);
      else cb(new Error('CORS blocked'));
    },
    credentials: true,
  }));

  // perf & parsing
  app.use(compression());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(mongoSanitize());
  app.use(xss());
  app.use(hpp({ whitelist: ['amenities', 'tags'] }));

  // logging
  app.use(morgan(isProd ? 'combined' : 'dev', {
    stream: { write: (msg) => logger.info(msg.trim()) },
  }));

  // rate limit on the API surface
  app.use(env.API_PREFIX, rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 'fail', message: 'Too many requests, please try again later' },
  }));

  // mount routes
  app.use(env.API_PREFIX, routes);

  // 404 + error handler last
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
