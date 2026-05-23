'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { LayoutGrid, Map } from 'lucide-react';
import { cn } from '@/lib/utils';

export type View = 'list' | 'map';

export default function ViewToggle() {
  const t = useTranslations('map_view');
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [, startTransition] = useTransition();

  const current: View = sp.get('view') === 'map' ? 'map' : 'list';

  function set(view: View) {
    const params = new URLSearchParams(sp.toString());
    if (view === 'list') params.delete('view');
    else params.set('view', view);
    params.delete('page');
    startTransition(() => {
      router.replace(`${pathname}${params.toString() ? `?${params}` : ''}` as never, { scroll: false });
    });
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-ink-900/40 p-1">
      <Btn active={current === 'list'} onClick={() => set('list')} Icon={LayoutGrid} label={t('list')} />
      <Btn active={current === 'map'} onClick={() => set('map')} Icon={Map} label={t('map')} />
    </div>
  );
}

function Btn({
  active, onClick, Icon, label,
}: {
  active: boolean;
  onClick: () => void;
  Icon: typeof LayoutGrid;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] transition-colors',
        active ? 'bg-gold-gradient text-ink-900 shadow-gold' : 'text-ivory/75 hover:text-gold'
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
