'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  Building2, Handshake, KeyRound, Briefcase, Sparkles, Building,
  Crown, LineChart, Users, Megaphone, Tag, Network, Wrench,
  Hammer, Lightbulb, Banknote, BadgeCheck, Globe2, ArrowUpRight,
} from 'lucide-react';

const services = [
  { k: 'sales', Icon: Tag },
  { k: 'buying', Icon: KeyRound },
  { k: 'rentals', Icon: Handshake },
  { k: 'commercial', Icon: Briefcase },
  { k: 'villas', Icon: Building },
  { k: 'apartments', Icon: Building2 },
  { k: 'penthouses', Icon: Crown },
  { k: 'investment', Icon: LineChart },
  { k: 'broker', Icon: Users },
  { k: 'marketing', Icon: Megaphone },
  { k: 'owned', Icon: Sparkles },
  { k: 'partners', Icon: Network },
  { k: 'management', Icon: Wrench },
  { k: 'offplan', Icon: Hammer },
  { k: 'consultancy', Icon: Lightbulb },
  { k: 'mortgage', Icon: Banknote },
  { k: 'visa', Icon: BadgeCheck },
  { k: 'international', Icon: Globe2 },
] as const;

export default function Services() {
  const t = useTranslations('services');

  return (
    <section id="services" className="relative isolate overflow-hidden py-28 md:py-36">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-900 via-ink-800/40 to-ink-900" />
      <div className="absolute -left-32 top-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute -right-32 bottom-0 -z-10 h-[480px] w-[480px] rounded-full bg-gold/5 blur-3xl" />

      <div className="container-luxe">
        <div className="grid items-end gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-12%' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">{t('eyebrow')}</p>
            <h2 className="mt-5 display text-4xl text-ivory md:text-6xl">{t('title')}</h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-12%' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="text-base text-ivory/70 md:max-w-md md:justify-self-end md:text-right rtl:md:text-left"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ k, Icon }, i) => (
            <motion.div
              key={k}
              id={k}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (i % 6) * 0.04 }}
            >
              <Link
                href={`/services#${k}` as never}
                className="group relative flex h-full items-start gap-5 rounded-2xl border border-white/[0.06] bg-ink-800/40 p-7 transition-all duration-500 hover:border-gold/40 hover:bg-ink-800/70"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold ring-1 ring-gold/20 transition-all group-hover:bg-gold group-hover:text-ink-900">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <h3 className="font-display text-xl text-ivory transition-colors group-hover:text-gold">
                    {t(`items.${k}.t`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/65">
                    {t(`items.${k}.d`)}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.24em] text-gold/0 transition-all group-hover:text-gold">
                    {t('learn_more')}
                    <ArrowUpRight className="h-3 w-3 rtl:rotate-90" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
