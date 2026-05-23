import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Pagination({
  page, pages, baseQuery,
}: {
  page: number;
  pages: number;
  baseQuery: Record<string, string | undefined>;
}) {
  const t = useTranslations('properties_index');
  if (pages <= 1) return null;

  const hrefFor = (p: number) => {
    const sp = new URLSearchParams();
    Object.entries(baseQuery).forEach(([k, v]) => { if (v) sp.set(k, v); });
    if (p > 1) sp.set('page', String(p));
    else sp.delete('page');
    const qs = sp.toString();
    return `/properties${qs ? `?${qs}` : ''}` as never;
  };

  const window = pageWindow(page, pages);

  return (
    <nav className="mt-16 flex items-center justify-center gap-2" aria-label="Pagination">
      <PageBtn href={hrefFor(Math.max(1, page - 1))} disabled={page === 1} label={t('prev')}>
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
      </PageBtn>
      {window.map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="px-2 text-ivory/40">…</span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            scroll={false}
            className={cn(
              'inline-grid h-10 min-w-[2.5rem] place-items-center rounded-full border px-3 text-sm transition-colors',
              p === page
                ? 'border-gold bg-gold-gradient text-ink-900 shadow-gold'
                : 'border-white/12 text-ivory/80 hover:border-gold hover:text-gold'
            )}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </Link>
        )
      )}
      <PageBtn href={hrefFor(Math.min(pages, page + 1))} disabled={page === pages} label={t('next')}>
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
      </PageBtn>
    </nav>
  );
}

function PageBtn({
  href, disabled, children, label,
}: {
  href: never; disabled: boolean; children: React.ReactNode; label: string;
}) {
  const cls = cn(
    'inline-grid h-10 w-10 place-items-center rounded-full border text-ivory/80 transition-colors',
    disabled ? 'border-white/[0.06] opacity-40 pointer-events-none' : 'border-white/12 hover:border-gold hover:text-gold'
  );
  return (
    <Link href={href} scroll={false} className={cls} aria-label={label} aria-disabled={disabled}>
      {children}
    </Link>
  );
}

function pageWindow(page: number, pages: number): (number | '…')[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const out: (number | '…')[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pages - 1, page + 1);
  if (start > 2) out.push('…');
  for (let p = start; p <= end; p++) out.push(p);
  if (end < pages - 1) out.push('…');
  out.push(pages);
  return out;
}
