'use client';

import { useTranslations } from 'next-intl';
import { Scale, Check } from 'lucide-react';
import { useCompareStore, MAX_COMPARE } from '@/lib/comparison-store';
import { cn } from '@/lib/utils';

/**
 * Button placed on PropertyCard / detail page to toggle a property into the
 * comparison tray. Disables itself when the tray is full unless this card is
 * already in it.
 */
export default function CompareToggle({
  slug, variant = 'icon',
}: {
  slug: string;
  variant?: 'icon' | 'pill';
}) {
  const t = useTranslations('compare');
  const slugs = useCompareStore((s) => s.slugs);
  const toggle = useCompareStore((s) => s.toggle);

  const active = slugs.includes(slug);
  const full = !active && slugs.length >= MAX_COMPARE;
  const label = full ? t('card_action_full') : active ? t('card_action_remove') : t('card_action_add');

  function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (full) return;
    toggle(slug);
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        disabled={full}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-all duration-300',
          active
            ? 'border-gold bg-gold/10 text-gold'
            : 'border-white/12 text-ivory/85 hover:border-gold hover:text-gold',
          full && 'cursor-not-allowed opacity-40'
        )}
      >
        {active ? <Check className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      disabled={full}
      className={cn(
        'inline-grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition-all',
        active
          ? 'border-gold bg-gold text-ink-900'
          : 'border-white/20 bg-ink-900/50 text-ivory hover:border-gold hover:text-gold',
        full && 'cursor-not-allowed opacity-40'
      )}
    >
      {active ? <Check className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
    </button>
  );
}
