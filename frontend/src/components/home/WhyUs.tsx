'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Diamond, BarChart3, Globe, ShieldCheck } from 'lucide-react';

const items = [
  { k: 'concierge', Icon: Diamond },
  { k: 'data', Icon: BarChart3 },
  { k: 'global', Icon: Globe },
  { k: 'aftercare', Icon: ShieldCheck },
] as const;

export default function WhyUs() {
  const t = useTranslations('why');

  return (
    <section className="relative py-28 md:py-36">
      <div className="container-luxe">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-12%' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="eyebrow justify-center">{t('eyebrow')}</p>
          <h2 className="mt-5 display text-4xl text-ivory md:text-6xl">{t('title')}</h2>
        </motion.div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ k, Icon }, i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
              className="group relative bg-ink-900 p-8 md:p-10"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-gold/30 text-gold transition-all group-hover:bg-gold group-hover:text-ink-900">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-6 font-display text-2xl text-ivory">
                {t(`items.${k}.t`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/65">
                {t(`items.${k}.d`)}
              </p>
              <span className="mt-6 inline-block text-xs uppercase tracking-[0.32em] text-gold/40">
                · 0{i + 1}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
