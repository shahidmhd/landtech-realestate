'use client';

import { useCallback, useEffect, useState } from 'react';

export const SAVED_KEY = 'luxe_saved_properties';

function read(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/**
 * Subscribes to the localStorage saved-properties list and stays in sync
 * across tabs + any in-page setSaved() updates.
 */
export function useSavedProperties() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSlugs(read());
    setReady(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === SAVED_KEY) setSlugs(read());
    };
    const onCustom = () => setSlugs(read());
    window.addEventListener('storage', onStorage);
    window.addEventListener('luxe:saved-changed', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('luxe:saved-changed', onCustom);
    };
  }, []);

  const persist = useCallback((next: string[]) => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    setSlugs(next);
    window.dispatchEvent(new Event('luxe:saved-changed'));
  }, []);

  const toggle = useCallback((slug: string) => {
    const current = read();
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    persist(next);
    return next.includes(slug);
  }, [persist]);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const clear = useCallback(() => persist([]), [persist]);

  return { slugs, ready, toggle, has, clear, count: slugs.length };
}
