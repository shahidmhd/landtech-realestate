'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Scale, X, ArrowRight } from 'lucide-react';
import { useCompareStore, MAX_COMPARE } from '@/lib/comparison-store';
import { properties as mockProperties } from '@/data/properties';

/**
 * Floating bottom-of-screen tray that surfaces selected properties for comparison.
 * Hidden until the user picks at least one. Locale-aware side so it doesn't
 * collide with the WhatsApp/Call buttons (RTL flips them).
 */
export default function CompareTray() {
  const t = useTranslations('compare');
  const locale = useLocale();
  const slugs = useCompareStore((s) => s.slugs);
  const hydrated = useCompareStore((s) => s.hydrated);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);

  if (!hydrated) return null;

  const items = slugs
    .map((s) => mockProperties.find((p) => p.slug === s))
    .filter(Boolean) as typeof mockProperties;

  // place opposite to the floating CTAs (ltr: bottom-left, rtl: bottom-right)
  const sideCls = locale === 'ar' ? 'right-4 sm:right-6' : 'left-4 sm:left-6';

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 220 }}
          className={`fixed bottom-6 z-40 w-[min(28rem,calc(100vw-2rem))] ${sideCls}`}
        >
          <div className="overflow-hidden rounded-2xl border border-gold/30 bg-ink-900/95 shadow-luxe backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-gold" />
                <span className="text-[11px] uppercase tracking-[0.28em] text-gold">
                  {t('tray_title')}
                </span>
                <span className="text-[11px] text-ivory/55">
                  {t('tray_count', { count: items.length, max: MAX_COMPARE })}
                </span>
              </div>
              <button
                type="button"
                onClick={clear}
                className="text-[10px] uppercase tracking-[0.24em] text-ivory/45 transition-colors hover:text-gold"
              >
                {t('tray_clear')}
              </button>
            </div>

            <ul className="space-y-2 px-3 pt-3">
              {items.map((p) => (
                <li key={p._id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-ink-800/40 p-2">
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-ink-700">
                    <Image src={p.cover} alt="" fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ivory">{p.title}</p>
                    <p className="mt-0.5 truncate text-[11px] text-ivory/55">{p.location}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(p.slug)}
                    aria-label="Remove"
                    className="grid h-8 w-8 place-items-center rounded-md text-ivory/60 transition-colors hover:bg-rose-500/15 hover:text-rose-300"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="p-3">
              <Link
                href="/compare"
                className="btn-gold w-full"
              >
                {t('tray_open')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
