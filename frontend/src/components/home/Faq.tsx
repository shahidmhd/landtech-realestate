'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';

export default function Faq() {
  const t = useTranslations('faq');
  const items = t.raw('items') as { q: string; a: string }[];
  const [open, setOpen] = useState<number | null>(0);

  // emit FAQPage schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };

  return (
    <section className="relative py-28 md:py-36">
      <div className="container-luxe grid gap-12 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-12%' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-4"
        >
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2 className="mt-5 display text-4xl text-ivory md:text-5xl">{t('title')}</h2>
        </motion.div>

        <ul className="space-y-3 lg:col-span-8">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
                className="overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-800/40"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 px-7 py-6 text-start"
                >
                  <span className="font-display text-xl text-ivory md:text-2xl">
                    {it.q}
                  </span>
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-ivory/80 transition-all ${
                      isOpen ? 'rotate-45 border-gold text-gold' : ''
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-7 pb-7 text-base leading-relaxed text-ivory/70">
                        {it.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
