'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import { properties as mockProperties } from '@/data/properties';
import PropertyCard from '@/components/home/PropertyCard';

/**
 * Saved-list is sourced from the same client-side store the heart button writes to.
 * We resolve slugs against mock data today; after the API wiring pass it'll resolve
 * from a /properties/by-slugs endpoint.
 */
export default function SavedClient() {
  const t = useTranslations('saved');
  const { slugs, ready, clear, count } = useSavedProperties();

  const items = useMemo(
    () => slugs.map((s) => mockProperties.find((p) => p.slug === s)).filter(Boolean) as typeof mockProperties,
    [slugs]
  );

  if (!ready) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-white/[0.08] bg-ink-800/40 p-12 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/10 text-gold ring-1 ring-gold/30">
          <Heart className="h-6 w-6" />
        </div>
        <p className="mt-6 font-display text-3xl text-ivory">{t('empty_title')}</p>
        <p className="mt-3 text-sm text-ivory/65">{t('empty_body')}</p>
        <Link href="/properties" className="btn-gold mt-8 inline-flex">
          {t('browse')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ivory/65">{t('count', { count })}</p>
        <button
          type="button"
          onClick={() => {
            if (confirm('Clear all saved properties?')) clear();
          }}
          className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-ivory/65 transition-colors hover:border-rose-500/40 hover:text-rose-300"
        >
          <Trash2 className="h-3.5 w-3.5" />
          {t('clear_all')}
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => (
          <PropertyCard key={p._id} p={p} index={i} />
        ))}
      </div>
    </>
  );
}
