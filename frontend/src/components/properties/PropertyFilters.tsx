'use client';

import { useState, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterState {
  q: string;
  location: string;
  type: string;
  status: string;
  beds: string;
  baths: string;
  priceMin: string;
  priceMax: string;
}

const EMPTY: FilterState = {
  q: '', location: '', type: '', status: '',
  beds: '', baths: '', priceMin: '', priceMax: '',
};

function readState(sp: URLSearchParams): FilterState {
  return {
    q: sp.get('q') ?? '',
    location: sp.get('location') ?? '',
    type: sp.get('type') ?? '',
    status: sp.get('status') ?? '',
    beds: sp.get('beds') ?? '',
    baths: sp.get('baths') ?? '',
    priceMin: sp.get('priceMin') ?? '',
    priceMax: sp.get('priceMax') ?? '',
  };
}

export default function PropertyFilters() {
  const t = useTranslations('properties_index');
  const tc = useTranslations('search');
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<FilterState>(() => readState(sp));

  // sync on URL change (e.g. back/forward)
  useEffect(() => { setState(readState(sp)); }, [sp]);

  function push(next: FilterState) {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => { if (v) params.set(k, v); });
    // keep sort if it was set; clear page on new filter
    const sort = sp.get('sort');
    if (sort) params.set('sort', sort);
    startTransition(() => {
      router.replace(`${pathname}${params.toString() ? `?${params}` : ''}` as never, { scroll: false });
    });
  }

  function update<K extends keyof FilterState>(key: K, value: string) {
    const next = { ...state, [key]: value };
    setState(next);
    push(next);
  }

  function clearAll() {
    setState(EMPTY);
    push(EMPTY);
  }

  const activeChips = (Object.entries(state) as [keyof FilterState, string][])
    .filter(([, v]) => v)
    .map(([k, v]) => ({ key: k, label: chipLabel(k, v, tc) }));

  return (
    <>
      {/* desktop sticky panel */}
      <aside className="sticky top-28 hidden h-fit lg:block">
        <FilterPanel
          state={state}
          update={update}
          clearAll={clearAll}
          pending={pending}
        />
      </aside>

      {/* mobile trigger + active chips row */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.24em] text-ivory transition-colors hover:border-gold hover:text-gold"
        >
          <SlidersHorizontal className="h-4 w-4" /> {t('filters')}
          {activeChips.length > 0 && (
            <span className="grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-gold px-1.5 text-[10px] font-medium text-ink-900">
              {activeChips.length}
            </span>
          )}
        </button>
      </div>

      {/* active chips row (visible everywhere) */}
      {activeChips.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {activeChips.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => update(c.key, '')}
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs text-gold transition-colors hover:bg-gold/20"
            >
              {c.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="text-xs uppercase tracking-[0.24em] text-ivory/55 transition-colors hover:text-gold"
          >
            {t('filters_clear')}
          </button>
        </div>
      )}

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-ink-900/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-3xl border-t border-white/10 bg-ink-900 p-6 shadow-luxe"
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="font-display text-2xl">{t('filters')}</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <FilterPanel
                state={state}
                update={update}
                clearAll={clearAll}
                pending={pending}
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn-gold mt-6 w-full"
              >
                {t('filters_apply')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterPanel({
  state, update, clearAll, pending,
}: {
  state: FilterState;
  update: <K extends keyof FilterState>(k: K, v: string) => void;
  clearAll: () => void;
  pending: boolean;
}) {
  const t = useTranslations('properties_index');
  const tc = useTranslations('search');
  const tDet = useTranslations('property_detail');

  return (
    <div className={cn('space-y-6 rounded-2xl border border-white/[0.06] bg-ink-800/40 p-6', pending && 'opacity-75')}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.32em] text-gold">{t('filters')}</p>
        <button
          type="button"
          onClick={clearAll}
          className="text-[11px] uppercase tracking-[0.24em] text-ivory/55 transition-colors hover:text-gold"
        >
          {t('filters_clear')}
        </button>
      </div>

      <Field label={tc('location')}>
        <input
          value={state.location}
          onChange={(e) => update('location', e.target.value)}
          placeholder={tc('location_ph')}
          className="w-full bg-transparent text-sm text-ivory placeholder:text-ivory/30 focus:outline-none"
        />
      </Field>

      <Field label={tc('type')}>
        <NativeSelect
          value={state.type}
          onChange={(v) => update('type', v)}
          placeholder={tc('type_any')}
          options={['apartment', 'penthouse', 'villa', 'townhouse', 'commercial', 'plot'].map((v) => ({
            v, l: tDet(`category.${v as 'apartment'}`),
          }))}
        />
      </Field>

      <Field label={tc('status')}>
        <NativeSelect
          value={state.status}
          onChange={(v) => update('status', v)}
          placeholder={tc('status_any')}
          options={['ready', 'off-plan', 'resale', 'rental'].map((v) => ({
            v, l: tDet(`status.${v as 'ready'}`),
          }))}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label={tc('beds')}>
          <NativeSelect
            value={state.beds}
            onChange={(v) => update('beds', v)}
            placeholder={tc('beds_any')}
            options={[1, 2, 3, 4, 5, 6].map((n) => ({ v: String(n), l: `${n}+` }))}
          />
        </Field>
        <Field label={tc('baths')}>
          <NativeSelect
            value={state.baths}
            onChange={(v) => update('baths', v)}
            placeholder={tc('baths_any')}
            options={[1, 2, 3, 4, 5].map((n) => ({ v: String(n), l: `${n}+` }))}
          />
        </Field>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-ivory/45">{tc('price')}</p>
        <div className="mt-2 flex items-center gap-2">
          <NumberInput
            value={state.priceMin}
            onChange={(v) => update('priceMin', v)}
            placeholder="Min"
          />
          <span className="text-ivory/40">—</span>
          <NumberInput
            value={state.priceMax}
            onChange={(v) => update('priceMax', v)}
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block rounded-xl border border-white/[0.08] bg-ink-900/50 px-4 py-3 transition-colors focus-within:border-gold/40">
      <span className="block text-[10px] uppercase tracking-[0.28em] text-ivory/45">{label}</span>
      {children}
    </label>
  );
}

function NativeSelect({
  value, onChange, placeholder, options,
}: {
  value: string; onChange: (v: string) => void; placeholder: string;
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

function NumberInput({
  value, onChange, placeholder,
}: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="flex-1 rounded-lg border border-white/[0.08] bg-ink-900/50 px-3 py-2 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold/40 focus:outline-none"
    />
  );
}

function chipLabel(key: keyof FilterState, value: string, tc: (k: string) => string): string {
  switch (key) {
    case 'q': return `“${value}”`;
    case 'location': return value;
    case 'type': return value;
    case 'status': return value;
    case 'beds': return `${tc('beds')} ${value}+`;
    case 'baths': return `${tc('baths')} ${value}+`;
    case 'priceMin': return `≥ ${Number(value).toLocaleString()}`;
    case 'priceMax': return `≤ ${Number(value).toLocaleString()}`;
  }
}
