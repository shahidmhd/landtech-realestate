'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

const SORTS = ['newest', 'price-asc', 'price-desc', 'popular'] as const;
type Sort = (typeof SORTS)[number];

export default function SortDropdown() {
  const t = useTranslations('properties_index');
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [, startTransition] = useTransition();

  const current = (sp.get('sort') as Sort) || 'newest';

  function update(value: Sort) {
    const params = new URLSearchParams(sp.toString());
    if (value === 'newest') params.delete('sort');
    else params.set('sort', value);
    params.delete('page');
    startTransition(() => {
      router.replace(`${pathname}${params.toString() ? `?${params}` : ''}` as never, { scroll: false });
    });
  }

  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink-900/40 px-4 py-2 text-xs text-ivory/80">
      <ArrowUpDown className="h-3.5 w-3.5 text-gold" />
      <span className="uppercase tracking-[0.24em]">{t('sort_label')}</span>
      <select
        value={current}
        onChange={(e) => update(e.target.value as Sort)}
        className="bg-transparent text-xs focus:outline-none [&>option]:bg-ink-800"
        aria-label={t('sort_label')}
      >
        <option value="newest">{t('sort_newest')}</option>
        <option value="price-asc">{t('sort_price_asc')}</option>
        <option value="price-desc">{t('sort_price_desc')}</option>
        <option value="popular">{t('sort_popular')}</option>
      </select>
    </label>
  );
}
