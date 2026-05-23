'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';

const keys = ['sold', 'deals', 'agents', 'countries'] as const;

export default function Stats() {
  const t = useTranslations('stats');
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <section className="relative py-24 md:py-32" ref={ref}>
      <div className="container-luxe">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2 className="mt-5 display text-4xl text-ivory md:text-5xl">{t('title')}</h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/[0.06] md:grid-cols-4">
          {keys.map((k, i) => (
            <Stat
              key={k}
              value={t(`items.${k}.v`)}
              unit={t(`items.${k}.u`)}
              label={t(`items.${k}.l`)}
              animate={inView}
              delay={i * 0.12}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({
  value, unit, label, animate, delay,
}: {
  value: string; unit: string; label: string; animate: boolean; delay: number;
}) {
  const numeric = parseFloat(value);
  const isNumeric = !Number.isNaN(numeric);
  const [display, setDisplay] = useState(isNumeric ? '0' : value);

  useEffect(() => {
    if (!animate || !isNumeric) return;
    const start = performance.now();
    const duration = 1800;
    const from = 0;
    const to = numeric;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start - delay * 1000) / duration);
      if (t < 0) {
        raf = requestAnimationFrame(step);
        return;
      }
      const eased = 1 - Math.pow(1 - t, 3);
      const v = from + (to - from) * eased;
      setDisplay(v % 1 === 0 ? v.toFixed(0) : v.toFixed(1));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [animate, numeric, isNumeric, delay]);

  return (
    <div className="bg-ink-900 p-8 md:p-10">
      <p className="flex items-baseline gap-1 font-display text-5xl text-ivory md:text-6xl">
        <span className="gold-text">{display}</span>
        {unit && <span className="text-2xl text-ivory/60 md:text-3xl">{unit}</span>}
      </p>
      <p className="mt-3 text-[11px] uppercase tracking-[0.32em] text-ivory/55">{label}</p>
    </div>
  );
}
