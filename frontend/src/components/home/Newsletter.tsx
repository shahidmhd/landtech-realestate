'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Newsletter() {
  const t = useTranslations('newsletter');
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) return setState('error');
    setState('loading');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).catch(() => null);
      setState('done');
    } catch {
      setState('error');
    }
  }

  return (
    <section className="relative isolate overflow-hidden py-28 md:py-36">
      <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=2000&q=80&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-900/90 via-ink-900/80 to-ink-900" />

      <div className="container-luxe">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <Mail className="mx-auto h-8 w-8 text-gold" />
          <h2 className="mt-6 display text-4xl text-ivory md:text-6xl">{t('title')}</h2>
          <p className="mt-5 text-base leading-relaxed text-ivory/70 md:text-lg">{t('subtitle')}</p>

          <form
            onSubmit={submit}
            className="mx-auto mt-10 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setState('idle'); }}
              placeholder={t('placeholder')}
              className="flex-1 rounded-full border border-white/15 bg-ink-800/60 px-6 py-4 text-sm text-ivory placeholder:text-ivory/40 focus:border-gold focus:outline-none"
              aria-label={t('placeholder')}
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              className="btn-gold disabled:opacity-60"
            >
              {state === 'done' ? (
                <><CheckCircle2 className="h-4 w-4" /> ✓</>
              ) : (
                <>{t('submit')} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></>
              )}
            </button>
          </form>

          <p className="mt-5 text-xs text-ivory/45">{t('consent')}</p>
        </motion.div>
      </div>
    </section>
  );
}
