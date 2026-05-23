'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { api, auth, type AdminUser, ApiError } from '@/lib/api-client';

interface LoginResponse {
  status: 'success';
  user: AdminUser;
  accessToken: string;
  refreshToken: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // already signed in? send them to dashboard
  useEffect(() => {
    if (auth.getToken() && auth.getUser()) router.replace('/admin');
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post<LoginResponse>('/auth/login', form);
      auth.setToken(res.accessToken);
      auth.setUser(res.user);
      router.replace('/admin');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="absolute inset-0 -z-10 bg-radial-spot opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-gradient text-ink-900 shadow-gold">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
              <path
                d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <p className="font-display text-xl text-ivory">Luxe Estates</p>
            <p className="text-[11px] uppercase tracking-[0.32em] text-gold/80">Admin</p>
          </div>
        </div>

        <h1 className="mt-10 font-display text-4xl text-ivory">Welcome back</h1>
        <p className="mt-2 text-sm text-ivory/65">Sign in to manage properties, leads and content.</p>

        <form onSubmit={submit} className="mt-8 space-y-3">
          <Input
            label="Email"
            type="email"
            value={form.email}
            required
            onChange={(v) => setForm({ ...form, email: v })}
            autoFocus
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            required
            onChange={(v) => setForm({ ...form, password: v })}
          />

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold mt-2 w-full disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
            ) : (
              <><LogIn className="h-4 w-4" /> Sign in</>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[11px] uppercase tracking-[0.24em] text-ivory/40">
          Authorised personnel only
        </p>
      </motion.div>
    </main>
  );
}

function Input({
  label, type = 'text', value, required, onChange, autoFocus,
}: {
  label: string;
  type?: string;
  value: string;
  required?: boolean;
  onChange: (v: string) => void;
  autoFocus?: boolean;
}) {
  return (
    <label className="block rounded-xl border border-white/[0.08] bg-ink-800/40 px-4 py-3 transition-colors focus-within:border-gold/40">
      <span className="block text-[10px] uppercase tracking-[0.28em] text-ivory/45">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-base text-ivory placeholder:text-ivory/30 focus:outline-none"
      />
    </label>
  );
}
