'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Building2, Newspaper, MessageSquare,
  Quote, Settings, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { href: '/admin/properties', label: 'Properties', Icon: Building2 },
  { href: '/admin/blog', label: 'Insights', Icon: Newspaper },
  { href: '/admin/inquiries', label: 'Inquiries', Icon: MessageSquare },
  { href: '/admin/testimonials', label: 'Testimonials', Icon: Quote },
  { href: '/admin/settings', label: 'Settings', Icon: Settings },
];

interface Props {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open = false, onClose }: Props) {
  const pathname = usePathname();
  return (
    <>
      {/* mobile backdrop */}
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-ink-900/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/[0.06] bg-ink-900 transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/[0.06] px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-gradient text-ink-900 shadow-gold">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <path
                  d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8.5Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>
              <span className="block font-display text-lg text-ivory">Luxe Estates</span>
              <span className="block text-[10px] uppercase tracking-[0.32em] text-gold/80">Admin</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-ivory/70" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {nav.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors',
                      isActive
                        ? 'bg-gold/10 text-gold ring-1 ring-gold/30'
                        : 'text-ivory/75 hover:bg-white/[0.04] hover:text-ivory'
                    )}
                  >
                    <item.Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/[0.06] p-4">
          <Link
            href="/"
            target="_blank"
            className="block rounded-lg border border-white/12 px-4 py-2.5 text-center text-xs uppercase tracking-[0.24em] text-ivory/70 transition-colors hover:border-gold hover:text-gold"
          >
            View site ↗
          </Link>
        </div>
      </aside>
    </>
  );
}
