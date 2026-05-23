'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CheckCircle2, ArrowRight, MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/utils';

interface Props {
  propertySlug: string;
  propertyTitle: string;
}

type State = 'idle' | 'sending' | 'done' | 'error';

export default function InquiryForm({ propertySlug, propertyTitle }: Props) {
  const t = useTranslations('property_detail.inquiry');
  const [state, setState] = useState<State>('idle');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setState('sending');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          propertySlug,
          source: 'property',
          metadata: { propertyTitle },
        }),
      });
      if (!res.ok) throw new Error('failed');
      setState('done');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-gold/30 bg-gold/5 p-8 text-center"
      >
        <CheckCircle2 className="mx-auto h-10 w-10 text-gold" />
        <p className="mt-4 font-display text-2xl text-ivory">{t('success_title')}</p>
        <p className="mt-2 text-sm text-ivory/65">{t('success_body')}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-3xl border border-white/[0.08] bg-ink-800/40 p-7">
      <p className="eyebrow">{t('title')}</p>
      <h3 className="mt-3 font-display text-2xl text-ivory md:text-3xl">{t('subtitle')}</h3>

      <div className="mt-6 space-y-3">
        <Input
          label={t('name')} value={form.name} required
          onChange={(v) => setForm({ ...form, name: v })}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            type="email" label={t('email')} value={form.email} required
            onChange={(v) => setForm({ ...form, email: v })}
          />
          <Input
            type="tel" label={t('phone')} value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
        </div>
        <label className="block rounded-xl border border-white/[0.08] bg-ink-900/50 px-4 py-3 transition-colors focus-within:border-gold/40">
          <span className="block text-[10px] uppercase tracking-[0.28em] text-ivory/45">{t('message')}</span>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder={t('message_ph')}
            rows={4}
            className="w-full resize-none bg-transparent text-sm text-ivory placeholder:text-ivory/30 focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={state === 'sending'}
          className="btn-gold flex-1 disabled:opacity-60"
        >
          {state === 'sending' ? t('sending') : t('submit')}
          {state !== 'sending' && <ArrowRight className="h-4 w-4 rtl:rotate-180" />}
        </button>
        <a
          href={whatsappLink(`Hi, I'm interested in ${propertyTitle}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline flex-1"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
      </div>

      {state === 'error' && (
        <p className="mt-4 text-xs text-red-300/90">{t('error')}</p>
      )}
    </form>
  );
}

function Input({
  type = 'text', label, value, required, onChange,
}: {
  type?: string;
  label: string;
  value: string;
  required?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block rounded-xl border border-white/[0.08] bg-ink-900/50 px-4 py-3 transition-colors focus-within:border-gold/40">
      <span className="block text-[10px] uppercase tracking-[0.28em] text-ivory/45">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-sm text-ivory placeholder:text-ivory/30 focus:outline-none"
      />
    </label>
  );
}
