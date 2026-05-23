'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Props {
  categories: string[];
}

export default function CategoryFilter({ categories }: Props) {
  const t = useTranslations('blog_index');
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [, startTransition] = useTransition();

  const active = sp.get('category') || '';

  function setCategory(value: string) {
    const params = new URLSearchParams(sp.toString());
    if (!value) params.delete('category');
    else params.set('category', value);
    startTransition(() => {
      router.replace(`${pathname}${params.toString() ? `?${params}` : ''}` as never, { scroll: false });
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Chip active={!active} onClick={() => setCategory('')}>{t('all')}</Chip>
      {categories.map((c) => (
        <Chip key={c} active={active === c} onClick={() => setCategory(c)}>
          {c}
        </Chip>
      ))}
    </div>
  );
}

function Chip({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.24em] transition-colors',
        active
          ? 'border-gold bg-gold/10 text-gold'
          : 'border-white/12 text-ivory/75 hover:border-gold/40 hover:text-ivory'
      )}
    >
      {children}
    </button>
  );
}
