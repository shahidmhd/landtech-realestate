import nodemailer from 'nodemailer';
import { env } from '@/config/env';
import { logger } from './logger';

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!env.SMTP_HOST || !env.SMTP_USER) return null;
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  return transporter;
}

export async function sendLeadNotification(inquiry: {
  name: string; email: string; phone?: string; message?: string; source?: string;
  propertySlug?: string;
}) {
  const t = getTransporter();
  if (!t || !env.MAIL_TO_LEADS) {
    logger.info({ inquiry }, '[mailer] skipped — SMTP not configured');
    return;
  }
  await t.sendMail({
    from: env.MAIL_FROM,
    to: env.MAIL_TO_LEADS,
    subject: `New lead — ${inquiry.name}${inquiry.propertySlug ? ` (${inquiry.propertySlug})` : ''}`,
    text: [
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      `Phone: ${inquiry.phone || '—'}`,
      `Source: ${inquiry.source || 'contact'}`,
      `Property: ${inquiry.propertySlug || '—'}`,
      '',
      inquiry.message || '(no message)',
    ].join('\n'),
  });
}
