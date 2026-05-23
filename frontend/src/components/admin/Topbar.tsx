'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Props {
  onOpenSidebar: () => void;
}

export default function Topbar({ onOpenSidebar }: Props) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-ink-900/85 px-4 backdrop-blur-xl md:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open menu"
        className="grid h-10 w-10 place-items-center rounded-full border border-white/12 text-ivory/80 hover:border-gold hover:text-gold lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="ml-auto flex items-center gap-3" ref={ref}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-3 rounded-full border border-white/12 px-3 py-1.5 text-sm text-ivory transition-colors hover:border-gold/40"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gold/20 text-gold">
              <User className="h-3.5 w-3.5" />
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm leading-tight">{user?.name || '—'}</span>
              <span className="block text-[10px] uppercase tracking-[0.24em] text-ivory/45">
                {user?.role}
              </span>
            </span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/[0.08] bg-ink-800 shadow-luxe">
              <div className="border-b border-white/[0.06] px-4 py-3">
                <p className="text-sm text-ivory">{user?.name}</p>
                <p className="mt-0.5 text-xs text-ivory/55">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-ivory/85 transition-colors hover:bg-white/[0.04] hover:text-gold"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
