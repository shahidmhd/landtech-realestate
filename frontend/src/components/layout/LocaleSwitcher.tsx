'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTransition } from 'react';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { locales, type Locale } from '@/i18n/routing';

export default function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const next: Locale = locale === 'en' ? 'ar' : 'en';

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          router.replace(pathname, { locale: next });
        });
      }}
      className={cn(
        'inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-3 text-xs uppercase tracking-[0.18em]',
        'text-ivory/80 transition-all hover:border-gold hover:text-gold',
        pending && 'opacity-60'
      )}
      aria-label="Switch language"
    >
      <Globe className="h-3.5 w-3.5" />
      <span className="font-medium">{next.toUpperCase()}</span>
    </button>
  );
}

export const supportedLocales = locales;
