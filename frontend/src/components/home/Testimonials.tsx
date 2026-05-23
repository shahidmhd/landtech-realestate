'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const items = t.raw('items') as { q: string; n: string; r: string }[];
  const [i, setI] = useState(0);

  const prev = () => setI((p) => (p - 1 + items.length) % items.length);
  const next = () => setI((p) => (p + 1) % items.length);

  return (
    <section className="relative isolate overflow-hidden py-28 md:py-36">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-900 via-ink-800/30 to-ink-900" />
      <div className="absolute inset-x-0 top-1/2 -z-10 h-72 -translate-y-1/2 bg-radial-spot opacity-60" />

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

        <div className="relative mx-auto mt-16 max-w-4xl">
          <Quote className="mx-auto h-10 w-10 text-gold/50" />
          <div className="relative mt-6 min-h-[260px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <p className="font-display text-2xl leading-relaxed text-ivory md:text-3xl lg:text-4xl">
                  &ldquo;{items[i].q}&rdquo;
                </p>
                <footer className="mt-10">
                  <p className="text-base text-ivory">{items[i].n}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.32em] text-gold/80">
                    {items[i].r}
                  </p>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-12 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="inline-grid h-11 w-11 place-items-center rounded-full border border-white/15 text-ivory/80 transition-all hover:border-gold hover:text-gold"
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            </button>
            <div className="flex items-center gap-2">
              {items.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setI(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 transition-all ${
                    idx === i ? 'w-8 bg-gold' : 'w-1.5 bg-white/25 hover:bg-white/50'
                  } rounded-full`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="inline-grid h-11 w-11 place-items-center rounded-full border border-white/15 text-ivory/80 transition-all hover:border-gold hover:text-gold"
            >
              <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
