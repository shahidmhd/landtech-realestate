'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Search, MapPin, Home, Banknote, Bed, Bath, Tag } from 'lucide-react';

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function SearchBar() {
  const t = useTranslations('search');
  const tc = useTranslations('common');
  const router = useRouter();
  const [form, setForm] = useState({
    location: '',
    type: '',
    price: '',
    beds: '',
    baths: '',
    status: '',
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(form).filter(([, v]) => v))
    );
    router.push(`/properties?${params.toString()}` as never);
  }

  return (
    <section className="relative z-20 -mt-16 md:-mt-20">
      <div className="container-luxe">
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.9, ease }}
          onSubmit={submit}
          className="glass-dark rounded-2xl p-3 shadow-luxe md:p-4"
        >
          <p className="px-3 pt-2 text-[11px] uppercase tracking-[0.32em] text-gold/80 md:hidden">
            {t('title')}
          </p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-12 md:items-stretch">
            <Field icon={<MapPin />} label={t('location')} className="md:col-span-3">
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder={t('location_ph')}
                className="w-full bg-transparent text-sm text-ivory placeholder:text-ivory/40 focus:outline-none"
              />
            </Field>
            <Field icon={<Home />} label={t('type')} className="md:col-span-2">
              <Select
                value={form.type}
                onChange={(v) => setForm({ ...form, type: v })}
                placeholder={t('type_any')}
                options={[
                  { v: 'apartment', l: 'Apartment' },
                  { v: 'penthouse', l: 'Penthouse' },
                  { v: 'villa', l: 'Villa' },
                  { v: 'townhouse', l: 'Townhouse' },
                  { v: 'commercial', l: 'Commercial' },
                ]}
              />
            </Field>
            <Field icon={<Banknote />} label={t('price')} className="md:col-span-2">
              <Select
                value={form.price}
                onChange={(v) => setForm({ ...form, price: v })}
                placeholder={t('price_any')}
                options={[
                  { v: '0-2000000', l: 'Up to 2M' },
                  { v: '2000000-5000000', l: '2M – 5M' },
                  { v: '5000000-10000000', l: '5M – 10M' },
                  { v: '10000000-25000000', l: '10M – 25M' },
                  { v: '25000000-', l: '25M+' },
                ]}
              />
            </Field>
            <Field icon={<Bed />} label={tc('beds')} className="md:col-span-1">
              <Select
                value={form.beds}
                onChange={(v) => setForm({ ...form, beds: v })}
                placeholder={t('beds_any')}
                options={[1, 2, 3, 4, 5, 6].map((n) => ({ v: String(n), l: `${n}+` }))}
              />
            </Field>
            <Field icon={<Bath />} label={tc('baths')} className="md:col-span-1">
              <Select
                value={form.baths}
                onChange={(v) => setForm({ ...form, baths: v })}
                placeholder={t('baths_any')}
                options={[1, 2, 3, 4, 5].map((n) => ({ v: String(n), l: `${n}+` }))}
              />
            </Field>
            <Field icon={<Tag />} label={t('status')} className="md:col-span-2">
              <Select
                value={form.status}
                onChange={(v) => setForm({ ...form, status: v })}
                placeholder={t('status_any')}
                options={[
                  { v: 'ready', l: 'Ready' },
                  { v: 'off-plan', l: 'Off-plan' },
                  { v: 'resale', l: 'Resale' },
                  { v: 'rental', l: 'Rental' },
                ]}
              />
            </Field>

            <div className="md:col-span-1 md:flex md:items-stretch">
              <button
                type="submit"
                className="inline-flex h-full w-full items-center justify-center gap-2 rounded-xl bg-gold-gradient px-4 py-3 text-sm font-medium uppercase tracking-wide text-ink-900 transition-all hover:shadow-gold md:px-2"
                aria-label={t('submit')}
              >
                <Search className="h-4 w-4" />
                <span className="md:hidden">{t('submit')}</span>
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
}

function Field({
  icon, label, children, className = '',
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex items-center gap-3 overflow-hidden rounded-xl border border-white/[0.06] bg-ink-800/40 px-4 py-3 transition-colors focus-within:border-gold/40 ${className}`}>
      <span className="shrink-0 text-gold/80 [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[10px] uppercase tracking-[0.2em] text-ivory/45">{label}</span>
        {children}
      </span>
    </label>
  );
}

function Select({
  value, onChange, placeholder, options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { v: string; l: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent text-sm text-ivory focus:outline-none [&>option]:bg-ink-800 [&>option]:text-ivory"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.v} value={o.v}>{o.l}</option>
      ))}
    </select>
  );
}
