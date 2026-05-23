'use client';

import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { MapPin, TrendingUp, Sparkles } from 'lucide-react';
import { formatAed } from '@/lib/utils';
import type { Property } from '@/types/property';

export default function PropertyHeader({ p }: { p: Property }) {
  const tc = useTranslations('common');
  const td = useTranslations('property_detail');
  const locale = useLocale();

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_auto]">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="dark">{td(`status.${p.status}`)}</Badge>
          <Badge tone="dark">{td(`category.${p.category}`)}</Badge>
          {p.featured && <Badge tone="gold">{tc('featured')}</Badge>}
          {p.trending && <Badge tone="ivory">{tc('trending')}</Badge>}
          {p.newLaunch && <Badge tone="gold">{tc('new')}</Badge>}
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 display text-4xl text-ivory md:text-6xl"
        >
          {p.title}
        </motion.h1>

        <p className="mt-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-ivory/65">
          <MapPin className="h-4 w-4 text-gold" />
          {p.location}{p.community ? ` · ${p.community}` : ''}
        </p>
      </div>

      <div className="lg:text-right rtl:lg:text-left">
        <p className="text-[10px] uppercase tracking-[0.32em] text-ivory/50">{tc('from')}</p>
        <p className="mt-2 font-display text-4xl md:text-5xl">
          <span className="gold-text">{tc('aed')} {formatAed(p.price, locale)}</span>
        </p>
        {p.pricePerSqft && (
          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-ivory/55">
            {tc('aed')} {p.pricePerSqft.toLocaleString()} {td('specs.per_sqft').toLowerCase()}
          </p>
        )}
        {(p.investmentScore || p.roiAnnualPercent) && (
          <div className="mt-4 inline-flex flex-wrap gap-4 text-xs">
            {p.investmentScore && (
              <span className="inline-flex items-center gap-1.5 text-ivory/75">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                {td('investment_score')}: <span className="text-ivory">{p.investmentScore}/100</span>
              </span>
            )}
            {p.roiAnnualPercent && (
              <span className="inline-flex items-center gap-1.5 text-ivory/75">
                <TrendingUp className="h-3.5 w-3.5 text-gold" />
                {td('expected_roi')}: <span className="text-ivory">{p.roiAnnualPercent}%</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: 'gold' | 'ivory' | 'dark' }) {
  const styles =
    tone === 'gold'
      ? 'bg-gold-gradient text-ink-900'
      : tone === 'ivory'
      ? 'bg-ivory/95 text-ink-900'
      : 'bg-ink-800 text-ivory border border-white/12';
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] ${styles}`}>
      {children}
    </span>
  );
}
