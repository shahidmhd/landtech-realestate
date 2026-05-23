import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAed(value: number, locale: string = 'en') {
  if (!Number.isFinite(value)) return '';
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-AE' : 'en-AE').format(value);
}

export function siteUrl(path: string = '') {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

export function whatsappLink(text?: string) {
  const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '971500000000';
  const encoded = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${num}${encoded}`;
}

export function phoneLink() {
  return `tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER || '+97140000000'}`;
}
