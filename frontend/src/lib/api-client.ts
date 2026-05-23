/**
 * Tiny typed fetch wrapper for the admin app.
 * - Reads JWT from localStorage and adds Authorization: Bearer
 * - Unwraps { status, data } envelopes from our Express API
 * - On 401, clears the token and lets the caller redirect
 */

const TOKEN_KEY = 'luxe_admin_token';
const USER_KEY = 'luxe_admin_user';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'broker' | 'user';
}

export const auth = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getUser(): AdminUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser(user: AdminUser) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, query, headers, ...rest } = options;

  let url = `${API_URL}${path}`;
  if (query) {
    const sp = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
    });
    const qs = sp.toString();
    if (qs) url += `?${qs}`;
  }

  const token = auth.getToken();
  const finalHeaders: HeadersInit = {
    ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers || {}),
  };

  const res = await fetch(url, {
    ...rest,
    headers: finalHeaders,
    body:
      body instanceof FormData
        ? body
        : body !== undefined
        ? JSON.stringify(body)
        : undefined,
  });

  if (res.status === 401) {
    auth.clear();
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
      window.location.href = '/admin/login';
    }
    throw new ApiError('Unauthorized', 401);
  }

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      (data as { message?: string }).message || `Request failed (${res.status})`,
      res.status
    );
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, query?: RequestOptions['query']) =>
    request<T>(path, { method: 'GET', query }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body }),
  delete: <T = void>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
  upload: <T>(path: string, files: File[]) => {
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    return request<T>(path, { method: 'POST', body: fd });
  },
};

export interface ApiResponse<T> { status: 'success'; data: T }
export interface ApiList<T> extends ApiResponse<T[]> {
  pagination?: { page: number; limit: number; total: number; pages: number };
}
