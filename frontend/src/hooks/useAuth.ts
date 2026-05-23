'use client';

import { useCallback, useEffect, useState } from 'react';
import { auth, type AdminUser } from '@/lib/api-client';

/**
 * Reads admin auth from localStorage. Stays in sync across tabs.
 */
export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(auth.getUser());
    setReady(true);
    const handler = (e: StorageEvent) => {
      if (e.key === 'luxe_admin_user') setUser(auth.getUser());
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const logout = useCallback(() => {
    auth.clear();
    setUser(null);
    if (typeof window !== 'undefined') window.location.href = '/admin/login';
  }, []);

  return { user, ready, isAuthenticated: !!user, logout };
}
