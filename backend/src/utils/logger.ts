import winston from 'winston';
import { isProd } from '@/config/env';

export const logger = winston.createLogger({
  level: isProd ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    isProd
      ? winston.format.json()
      : winston.format.printf(({ level, message, timestamp, ...meta }) => {
          const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
          return `${timestamp} ${level}: ${typeof message === 'string' ? message : JSON.stringify(message)}${extra}`;
        })
  ),
  transports: [new winston.transports.Console()],
});
