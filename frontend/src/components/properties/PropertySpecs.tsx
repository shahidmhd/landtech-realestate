import { useTranslations } from 'next-intl';
import { Bed, Bath, Maximize2, Car, Building2, BadgeCheck, CalendarDays, Hammer, Coins, ScrollText } from 'lucide-react';
import type { Property } from '@/types/property';

export default function PropertySpecs({ p }: { p: Property }) {
  const t = useTranslations('property_detail');

  const items = [
    { Icon: Bed, label: t('specs.beds'), value: p.bedrooms },
    { Icon: Bath, label: t('specs.baths'), value: p.bathrooms },
    { Icon: Maximize2, label: t('specs.area'), value: `${p.areaSqft.toLocaleString()} sqft` },
    p.parking && { Icon: Car, label: t('specs.parking'), value: p.parking },
    { Icon: Building2, label: t('specs.type'), value: t(`category.${p.category}`) },
    { Icon: BadgeCheck, label: t('specs.status'), value: t(`status.${p.status}`) },
    p.developer && { Icon: Hammer, label: t('specs.developer'), value: p.developer },
    p.handover && { Icon: CalendarDays, label: t('specs.handover'), value: p.handover },
    p.yearBuilt && { Icon: CalendarDays, label: t('specs.year'), value: p.yearBuilt },
    p.pricePerSqft && { Icon: Coins, label: t('specs.per_sqft'), value: `AED ${p.pricePerSqft.toLocaleString()}` },
    p.paymentPlan && { Icon: ScrollText, label: t('specs.payment_plan'), value: p.paymentPlan },
  ].filter(Boolean) as { Icon: typeof Bed; label: string; value: string | number }[];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/[0.06] sm:grid-cols-3 lg:grid-cols-4">
      {items.map(({ Icon, label, value }) => (
        <div key={label} className="bg-ink-900 p-6">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-ivory/45">
            <Icon className="h-3.5 w-3.5 text-gold" />
            {label}
          </div>
          <p className="mt-3 font-display text-2xl text-ivory">{value}</p>
        </div>
      ))}
    </div>
  );
}
