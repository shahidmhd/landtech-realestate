'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { TrendingUp, Receipt, BadgeCheck, LineChart, ArrowRight } from 'lucide-react';

const points = [
  { k: 'yield', Icon: LineChart },
  { k: 'tax', Icon: Receipt },
  { k: 'visa', Icon: BadgeCheck },
  { k: 'growth', Icon: TrendingUp },
] as const;

export default function Investors() {
  const t = useTranslations('investors');

  return (
    <section className="relative isolate overflow-hidden py-28 md:py-36">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545159682-cbef67b71540?w=2000&q=80&auto=format&fit=crop')] bg-cover bg-fixed bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900 via-ink-900/85 to-ink-900" />
      </div>

      <div className="container-luxe">
        <div className="grid items-start gap-16 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-12%' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <p className="eyebrow">{t('eyebrow')}</p>
            <h2 className="mt-5 display text-4xl text-ivory md:text-6xl">{t('title')}</h2>
            <p className="mt-6 text-base leading-relaxed text-ivory/70 md:text-lg">{t('subtitle')}</p>
            <Link href="/contact" className="btn-gold mt-10 inline-flex">
              {t('cta')} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
            {points.map(({ k, Icon }, i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-12%' }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-800/40 p-8 backdrop-blur-sm transition-all hover:border-gold/40"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-gradient text-ink-900 shadow-gold">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-display text-2xl text-ivory">
                  {t(`points.${k}.t`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/65">
                  {t(`points.${k}.d`)}
                </p>
                <span className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-gold/20 blur-3xl transition-opacity group-hover:opacity-60" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
