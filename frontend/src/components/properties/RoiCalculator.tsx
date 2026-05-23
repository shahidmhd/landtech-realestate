'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { LineChart } from 'lucide-react';

export default function RoiCalculator({
  price, areaSqft, defaultRoi = 6.5,
}: {
  price: number; areaSqft: number; defaultRoi?: number;
}) {
  const t = useTranslations('property_detail.calc');

  const [annualRentK, setAnnualRentK] = useState(Math.round((price * defaultRoi) / 100 / 1000));
  const [occupancy, setOccupancy] = useState(90);
  const [serviceCharge, setServiceCharge] = useState(18);

  const { gross, net } = useMemo(() => {
    const annualRent = annualRentK * 1000;
    const effectiveRent = annualRent * (occupancy / 100);
    const annualServiceCharge = serviceCharge * areaSqft;
    const net = effectiveRent - annualServiceCharge;
    return {
      gross: (annualRent / price) * 100,
      net: (net / price) * 100,
    };
  }, [annualRentK, occupancy, serviceCharge, price, areaSqft]);

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-ink-800/40 p-7">
      <p className="eyebrow">
        <LineChart className="h-3.5 w-3.5" />
        {t('roi_title')}
      </p>
      <p className="mt-3 text-sm text-ivory/60">{t('roi_lead')}</p>

      <div className="mt-6 space-y-5">
        <RangeRow label={t('annual_rent')} value={`AED ${(annualRentK * 1000).toLocaleString()}`}>
          <input
            type="range"
            min={Math.round((price * 0.03) / 1000)}
            max={Math.round((price * 0.12) / 1000)}
            step={5}
            value={annualRentK}
            onChange={(e) => setAnnualRentK(Number(e.target.value))}
            className="luxe-range"
            aria-label={t('annual_rent')}
          />
        </RangeRow>
        <RangeRow label={t('occupancy')} value={`${occupancy}%`}>
          <input
            type="range" min={50} max={100} step={1}
            value={occupancy}
            onChange={(e) => setOccupancy(Number(e.target.value))}
            className="luxe-range"
            aria-label={t('occupancy')}
          />
        </RangeRow>
        <RangeRow label={t('service_charge')} value={`AED ${serviceCharge}`}>
          <input
            type="range" min={8} max={45} step={1}
            value={serviceCharge}
            onChange={(e) => setServiceCharge(Number(e.target.value))}
            className="luxe-range"
            aria-label={t('service_charge')}
          />
        </RangeRow>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3">
        <Stat label={t('gross_yield')} value={`${gross.toFixed(2)}%`} />
        <Stat label={t('net_yield')} value={`${net.toFixed(2)}%`} highlight />
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
      <p className={`mt-2 font-display text-2xl leading-tight ${highlight ? 'text-ink-900' : 'text-ivory'}`}>{value}</p>
    </div>
  );
}
