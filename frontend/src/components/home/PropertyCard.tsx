'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowUpRight, Bath, Bed, Maximize2, MapPin } from 'lucide-react';
import { formatAed } from '@/lib/utils';
import type { Property } from '@/types/property';
import CompareToggle from '@/components/properties/CompareToggle';

export default function PropertyCard({ p, index = 0 }: { p: Property; index?: number }) {
  const tc = useTranslations('common');
  const locale = useLocale();
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
      className="group relative overflow-hidden rounded-3xl bg-ink-800 ring-1 ring-white/[0.06]"
    >
      <Link href={`/properties/${p.slug}` as never} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={p.cover}
            alt={p.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-luxe group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />

          {/* badges */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {p.featured && <Badge tone="gold">{tc('featured')}</Badge>}
            {p.trending && <Badge tone="ivory">{tc('trending')}</Badge>}
            {p.newLaunch && <Badge tone="dark">{tc('new')}</Badge>}
          </div>

          {/* top-right actions */}
          <div className="absolute right-4 top-4 flex flex-col gap-2 rtl:left-4 rtl:right-auto">
            <span className="inline-grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-ink-900/50 text-ivory backdrop-blur-md transition-all group-hover:border-gold group-hover:text-gold">
              <ArrowUpRight className="h-4 w-4 rtl:rotate-90" />
            </span>
            <CompareToggle slug={p.slug} />
          </div>

          {/* content */}
          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.24em] text-gold/90">
              <MapPin className="h-3 w-3" />
              {p.location}
            </p>
            <h3 className="mt-2 font-display text-2xl leading-tight text-ivory">
              {p.title}
            </h3>

            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="text-sm">
                <span className="text-ivory/55">{tc('from')} </span>
                <span className="text-ivory font-medium">
                  {tc('aed')} {formatAed(p.price, locale)}
                </span>
              </p>
              <ul className="flex items-center gap-3 text-xs text-ivory/70">
                <li className="inline-flex items-center gap-1"><Bed className="h-3.5 w-3.5 text-gold/80" /> {p.bedrooms}</li>
                <li className="inline-flex items-center gap-1"><Bath className="h-3.5 w-3.5 text-gold/80" /> {p.bathrooms}</li>
                <li className="inline-flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5 text-gold/80" /> {p.areaSqft.toLocaleString()}</li>
              </ul>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: 'gold' | 'ivory' | 'dark' }) {
  const styles =
    tone === 'gold'
      ? 'bg-gold-gradient text-ink-900'
      : tone === 'ivory'
      ? 'bg-ivory/95 text-ink-900'
      : 'bg-ink-900/80 text-ivory border border-white/20';
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] ${styles}`}>
      {children}
    </span>
  );
}
