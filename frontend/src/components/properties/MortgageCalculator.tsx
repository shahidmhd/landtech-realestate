'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Calculator } from 'lucide-react';

export default function MortgageCalculator({ price }: { price: number }) {
  const t = useTranslations('property_detail.calc');

  const [downPercent, setDownPercent] = useState(25);
  const [years, setYears] = useState(25);
  const [rate, setRate] = useState(4.5);

  const { monthly, total, loan } = useMemo(() => {
    const loan = price * (1 - downPercent / 100);
    const n = years * 12;
    const r = rate / 100 / 12;
    const monthly = r === 0
      ? loan / n
      : (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthly * n;
    return { loan, monthly, total };
  }, [price, downPercent, years, rate]);

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-ink-800/40 p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">
            <Calculator className="h-3.5 w-3.5" />
            {t('mortgage_title')}
          </p>
          <p className="mt-3 text-sm text-ivory/60">{t('mortgage_lead')}</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <RangeRow
          label={t('down_payment')}
          value={`${downPercent}%`}
        >
          <input
            type="range" min={10} max={60} step={5}
            value={downPercent}
            onChange={(e) => setDownPercent(Number(e.target.value))}
            className="luxe-range"
            aria-label={t('down_payment')}
          />
        </RangeRow>
        <RangeRow label={t('loan_term_years')} value={`${years}`}>
          <input
            type="range" min={5} max={30} step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="luxe-range"
            aria-label={t('loan_term_years')}
          />
        </RangeRow>
        <RangeRow label={t('interest_rate')} value={`${rate.toFixed(2)}%`}>
          <input
            type="range" min={2} max={9} step={0.05}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="luxe-range"
            aria-label={t('interest_rate')}
          />
        </RangeRow>
      </div>

      <div className="mt-7 grid grid-cols-3 gap-3">
        <Stat label={t('loan_amount')} value={`AED ${Math.round(loan).toLocaleString()}`} />
        <Stat label={t('monthly_payment')} value={`AED ${Math.round(monthly).toLocaleString()}`} highlight />
        <Stat label={t('total_payment')} value={`AED ${Math.round(total).toLocaleString()}`} />
      </div>
    </div>
  );
}

function RangeRow({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[10px] uppercase tracking-[0.28em] text-ivory/55">{label}</span>
        <span className="font-display text-lg text-ivory">{value}</span>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ${highlight ? 'bg-gold-gradient text-ink-900 shadow-gold' : 'border border-white/[0.08] bg-ink-900/40'}`}>
      <p className={`text-[10px] uppercase tracking-[0.24em] ${highlight ? 'text-ink-900/70' : 'text-ivory/55'}`}>{label}</p>
      <p className={`mt-2 font-display text-lg leading-tight ${highlight ? 'text-ink-900' : 'text-ivory'}`}>{value}</p>
    </div>
  );
}
