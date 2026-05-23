'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight, ChevronLeft, Scale, X, Check } from 'lucide-react';
import { useCompareStore } from '@/lib/comparison-store';
import { properties as mockProperties } from '@/data/properties';
import { formatAed } from '@/lib/utils';
import type { Property } from '@/types/property';

export default function CompareClient() {
  const t = useTranslations('compare');
  const td = useTranslations('property_detail');
  const tc = useTranslations('common');
  const locale = useLocale();

  const slugs = useCompareStore((s) => s.slugs);
  const hydrated = useCompareStore((s) => s.hydrated);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);

  const items = useMemo(
    () => slugs.map((s) => mockProperties.find((p) => p.slug === s)).filter(Boolean) as Property[],
    [slugs]
  );

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-white/[0.08] bg-ink-800/40 p-12 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/10 text-gold ring-1 ring-gold/30">
          <Scale className="h-6 w-6" />
        </div>
        <p className="mt-6 font-display text-3xl text-ivory">{t('empty_title')}</p>
        <p className="mt-3 text-sm text-ivory/65">{t('empty_body')}</p>
        <Link href="/properties" className="btn-gold mt-8 inline-flex">
          {t('browse')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>
    );
  }

  // union of amenities across all properties — we render a check matrix below
  const allAmenities = Array.from(
    new Set(items.flatMap((p) => p.amenities))
  ).sort();

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/properties"
          className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.24em] text-ivory/55 transition-colors hover:text-gold"
        >
          <ChevronLeft className="h-3.5 w-3.5 rtl:rotate-180" />
          {t('back')}
        </Link>
        <button
          type="button"
          onClick={() => {
            if (confirm('Clear comparison?')) clear();
          }}
          className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-ivory/65 transition-colors hover:border-rose-500/40 hover:text-rose-300"
        >
          <X className="h-3.5 w-3.5" />
          {t('tray_clear')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 w-40 bg-ink-900 text-left text-[10px] uppercase tracking-[0.28em] text-ivory/45 rtl:right-0 rtl:left-auto" />
              {items.map((p) => (
                <th key={p._id} className="min-w-[260px] p-4 text-left align-top">
                  <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40">
                    <Link href={`/properties/${p.slug}` as never} className="block">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={p.cover}
                          alt={p.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, 80vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent" />
                      </div>
                      <div className="p-4">
                        <p className="font-display text-xl text-ivory">{p.title}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-gold/85">
                          {p.location}
                        </p>
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(p.slug)}
                      aria-label="Remove from comparison"
                      className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-ink-900/70 text-ivory backdrop-blur-md transition-colors hover:border-rose-500/40 hover:text-rose-300 rtl:left-3 rtl:right-auto"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <Row label={t('field.price')} items={items.map((p) => (
              <span className="font-display text-2xl">
                <span className="gold-text">{tc('aed')} {formatAed(p.price, locale)}</span>
              </span>
            ))} />
            <Row label={t('field.pricePerSqft')} items={items.map((p) => (
              p.pricePerSqft ? `${tc('aed')} ${p.pricePerSqft.toLocaleString()}` : '—'
            ))} />
            <Row label={t('field.type')} items={items.map((p) => td(`category.${p.category}`))} />
            <Row label={t('field.status')} items={items.map((p) => td(`status.${p.status}`))} />
            <Row label={t('field.bedrooms')} items={items.map((p) => String(p.bedrooms))} />
            <Row label={t('field.bathrooms')} items={items.map((p) => String(p.bathrooms))} />
            <Row label={t('field.area')} items={items.map((p) => `${p.areaSqft.toLocaleString()} sqft`)} />
            <Row label={t('field.parking')} items={items.map((p) => p.parking ?? '—')} />
            <Row label={t('field.developer')} items={items.map((p) => p.developer ?? '—')} />
            <Row label={t('field.handover')} items={items.map((p) => p.handover ?? '—')} />
            <Row label={t('field.year')} items={items.map((p) => p.yearBuilt ?? '—')} />
            <Row label={t('field.paymentPlan')} items={items.map((p) => p.paymentPlan ?? '—')} />
            <Row label={t('field.investmentScore')} items={items.map((p) =>
              p.investmentScore ? `${p.investmentScore} / 100` : '—'
            )} />
            <Row label={t('field.roi')} items={items.map((p) =>
              p.roiAnnualPercent ? `${p.roiAnnualPercent}%` : '—'
            )} />

            {/* amenities matrix */}
            <tr>
              <th className="sticky left-0 z-10 bg-ink-900 align-top px-4 py-6 text-left text-[10px] uppercase tracking-[0.28em] text-ivory/45 rtl:right-0 rtl:left-auto">
                {t('field.amenities')}
              </th>
              {items.map((p) => (
                <td key={p._id} className="border-t border-white/[0.06] px-4 py-6 align-top">
                  <ul className="space-y-2">
                    {allAmenities.map((a) => {
                      const has = p.amenities.includes(a);
                      return (
                        <li
                          key={a}
                          className={`flex items-center gap-2 text-[13px] ${has ? 'text-ivory' : 'text-ivory/30'}`}
                        >
                          <span
                            className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ring-1 ${
                              has ? 'bg-gold/10 text-gold ring-gold/30' : 'ring-white/10 text-ivory/25'
                            }`}
                          >
                            {has ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                          </span>
                          <span>{a}</span>
                        </li>
                      );
                    })}
                  </ul>
                </td>
              ))}
            </tr>

            {/* actions */}
            <tr>
              <th className="sticky left-0 z-10 bg-ink-900 px-4 py-6 rtl:right-0 rtl:left-auto" />
              {items.map((p) => (
                <td key={p._id} className="border-t border-white/[0.06] px-4 py-6 align-top">
                  <Link href={`/properties/${p.slug}` as never} className="btn-gold w-full">
                    {t('field.actions')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

function Row({ label, items }: { label: string; items: React.ReactNode[] }) {
  return (
    <tr>
      <th className="sticky left-0 z-10 bg-ink-900 px-4 py-4 text-left align-top text-[10px] uppercase tracking-[0.28em] text-ivory/45 rtl:right-0 rtl:left-auto">
        {label}
      </th>
      {items.map((value, i) => (
        <td key={i} className="border-t border-white/[0.06] px-4 py-4 align-top text-ivory">
          {value}
        </td>
      ))}
    </tr>
  );
}
