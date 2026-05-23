'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Phone, Heart } from 'lucide-react';
import { cn, phoneLink } from '@/lib/utils';
import { useSavedProperties } from '@/hooks/useSavedProperties';
import LocaleSwitcher from './LocaleSwitcher';

const nav = [
  { key: 'home', href: '/' },
  { key: 'properties', href: '/properties' },
  { key: 'services', href: '/services' },
  { key: 'projects', href: '/projects' },
  { key: 'about', href: '/about' },
  { key: 'blog', href: '/blog' },
  { key: 'contact', href: '/contact' },
] as const;

export default function Header() {
  const t = useTranslations('nav');
  const tBrand = useTranslations('brand');
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-luxe',
          scrolled
            ? 'bg-ink-900/85 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent'
        )}
      >
        <div className="container-luxe flex h-20 items-center justify-between">
          <Link href="/" className="group flex items-center gap-3" aria-label={tBrand('name')}>
            <Logo />
            <span className="hidden font-display text-xl tracking-wide text-ivory transition-colors group-hover:text-gold sm:block">
              {tBrand('name')}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {nav.map((item) => {
              const isActive =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    'relative px-4 py-2 text-sm tracking-wide transition-colors duration-300',
                    isActive ? 'text-gold' : 'text-ivory/80 hover:text-ivory'
                  )}
                >
                  <span>{t(item.key)}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-gold"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <SavedShortcut />
            <LocaleSwitcher />
            <a
              href={phoneLink()}
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/15 text-ivory/80 transition-all hover:border-gold hover:text-gold md:inline-flex"
              aria-label="Call"
            >
              <Phone className="h-4 w-4" />
            </a>
            <Link href="/contact" className="btn-gold hidden md:inline-flex">
              {t('cta')}
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-ivory lg:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-ink-900/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="container-luxe flex h-full flex-col pt-28 pb-12">
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {nav.map((item, i) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i + 0.1, duration: 0.5 }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center justify-between border-b border-white/[0.06] py-5 font-display text-3xl text-ivory transition-colors hover:text-gold"
                    >
                      <span>{t(item.key)}</span>
                      <ChevronDown className="h-4 w-4 -rotate-90 text-ivory/40" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-auto flex flex-col gap-3"
              >
                <Link href="/contact" className="btn-gold w-full">
                  {t('cta')}
                </Link>
                <a href={phoneLink()} className="btn-outline w-full">
                  <Phone className="h-4 w-4" /> {locale === 'ar' ? 'اتصل الآن' : 'Call now'}
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Logo() {
  return (
    <span className="relative grid h-10 w-10 place-items-center rounded-full bg-gold-gradient text-ink-900 shadow-gold">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
        <path
          d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function SavedShortcut() {
  const { count, ready } = useSavedProperties();
  return (
    <Link
      href="/saved"
      aria-label="Saved properties"
      className="relative hidden h-10 w-10 items-center justify-center rounded-full border border-white/15 text-ivory/80 transition-all hover:border-gold hover:text-gold md:inline-flex"
    >
      <Heart className={cn('h-4 w-4', ready && count > 0 && 'fill-current text-gold')} />
      {ready && count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-gold-gradient px-1.5 text-[10px] font-medium text-ink-900 shadow-gold">
          {count}
        </span>
      )}
    </Link>
  );
}
