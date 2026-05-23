'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight, Bed, Bath, Maximize2 } from 'lucide-react';
import { luxuryVillas as mockVillas } from '@/data/properties';
import type { Property } from '@/types/property';
import { formatAed } from '@/lib/utils';

export default function LuxuryShowcase({ items }: { items?: Property[] } = {}) {
  const t = useTranslations('luxury');
  const luxuryVillas = items && items.length > 0 ? items : mockVillas;
  const tc = useTranslations('common');
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  const hero = luxuryVillas[0];
  if (!hero) return null;

  return (
    <section id="showcase" ref={ref} className="relative isolate overflow-hidden py-28 md:py-36">
      <div className="container-luxe">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* hero villa */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:col-span-7"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] lg:aspect-[5/6]">
              <motion.div style={{ y }} className="absolute inset-0">
                <Image
                  src={hero.cover}
                  alt={hero.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                  priority
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 p-8 md:p-12">
                <p className="eyebrow">{t('eyebrow')}</p>
                <h3 className="mt-4 max-w-md font-display text-3xl text-ivory md:text-5xl">
                  {hero.title}
                </h3>
                <p className="mt-2 text-sm uppercase tracking-[0.24em] text-ivory/60">
                  {hero.location}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-ivory/80">
                  <span className="inline-flex items-center gap-1.5"><Bed className="h-4 w-4 text-gold" /> {hero.bedrooms} {tc('beds')}</span>
                  <span className="inline-flex items-center gap-1.5"><Bath className="h-4 w-4 text-gold" /> {hero.bathrooms} {tc('baths')}</span>
                  <span className="inline-flex items-center gap-1.5"><Maximize2 className="h-4 w-4 text-gold" /> {hero.areaSqft.toLocaleString()} {tc('sqft')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* text panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="lg:col-span-5"
          >
            <h2 className="display text-4xl text-ivory md:text-6xl">{t('title')}</h2>
            <p className="mt-6 text-base leading-relaxed text-ivory/70 md:text-lg">
              {t('subtitle')}
            </p>

            <ul className="mt-10 space-y-5">
              {luxuryVillas.slice(0, 3).map((v) => (
                <li key={v._id}>
                  <Link
                    href={`/properties/${v.slug}` as never}
                    className="group flex items-center justify-between gap-4 border-b border-white/[0.08] py-5 transition-colors hover:border-gold/40"
                  >
                    <span>
                      <span className="block font-display text-xl text-ivory transition-colors group-hover:text-gold">
                        {v.title}
                      </span>
                      <span className="mt-1 block text-xs uppercase tracking-[0.24em] text-ivory/55">
                        {v.location} · {tc('aed')} {formatAed(v.price, locale)}
                      </span>
                    </span>
                    <ArrowRight className="h-5 w-5 text-ivory/40 transition-all group-hover:translate-x-1 group-hover:text-gold rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>

            <Link href="/properties?category=villa" className="btn-outline mt-10 inline-flex">
              {t('cta')}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
