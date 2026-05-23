import { Link } from '@/i18n/routing';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.24em] text-ivory/55">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="inline-flex items-center gap-2">
              {c.href && !last ? (
                <Link href={c.href as never} className="transition-colors hover:text-gold">
                  {c.label}
                </Link>
              ) : (
                <span className={last ? 'text-gold' : ''}>{c.label}</span>
              )}
              {!last && <ChevronRight className="h-3 w-3 text-ivory/30 rtl:rotate-180" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
