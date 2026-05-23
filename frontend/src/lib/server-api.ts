/**
 * Server-side fetch helpers for the public site.
 * - SSR/ISR-friendly (`revalidate` defaults to 60s; pass cache: 'no-store' for live)
 * - Always returns plain JSON; throws on non-2xx so callers can use notFound()
 * - Reads the same NEXT_PUBLIC_API_URL the admin uses
 *
 * These run on the Next.js server, so they can also be called from server
 * components in the App Router.
 */

import type { Property, BlogPost } from '@/types/property';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface FetchOpts {
  query?: Record<string, string | number | boolean | undefined | null>;
  revalidate?: number | false;
  tags?: string[];
}

export class ServerApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function get<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const { query, revalidate = 60, tags } = opts;
  let url = `${API_URL}${path}`;
  if (query) {
    const sp = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
    });
    const qs = sp.toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    next: revalidate === false ? undefined : { revalidate, tags },
    cache: revalidate === false ? 'no-store' : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ServerApiError(
      text || `Request failed (${res.status})`,
      res.status
    );
  }
  return res.json() as Promise<T>;
}

// ---------- Properties ----------

interface PropertyEnvelope {
  status: 'success';
  data: RawProperty[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

interface RawProperty extends Omit<Property, 'gallery'> {
  gallery: ({ url: string } | string)[];
}

function normaliseProperty(p: RawProperty): Property {
  return {
    ...p,
    gallery: (p.gallery ?? []).map((g) => (typeof g === 'string' ? g : g.url)).filter(Boolean),
  };
}

export const propertiesApi = {
  async list(query?: FetchOpts['query']) {
    const res = await get<PropertyEnvelope>('/properties', { query });
    return {
      data: res.data.map(normaliseProperty),
      pagination: res.pagination,
    };
  },
  async featured(limit = 8) {
    const res = await get<{ status: 'success'; data: RawProperty[] }>(
      '/properties/featured',
      { query: { limit } }
    );
    return res.data.map(normaliseProperty);
  },
  async bySlug(slug: string) {
    const res = await get<{ status: 'success'; data: RawProperty; similar: RawProperty[] }>(
      `/properties/${encodeURIComponent(slug)}`,
      { revalidate: 30 }
    );
    return {
      data: normaliseProperty(res.data),
      similar: (res.similar ?? []).map(normaliseProperty),
    };
  },
};

// ---------- Blog ----------

import type { BlogBlock } from '@/types/property';

interface BlogEnvelope {
  status: 'success';
  data: RawBlog[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

interface RawBlog extends Omit<BlogPost, 'body'> {
  body?: BlogBlock[];
  content?: string;
}

function normaliseBlog(b: RawBlog): BlogPost {
  let body: BlogBlock[] = [];
  if (Array.isArray(b.body) && b.body.length) {
    body = b.body;
  } else if (typeof b.content === 'string' && b.content.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(b.content);
      if (Array.isArray(parsed)) body = parsed as BlogBlock[];
    } catch {}
  } else if (typeof b.content === 'string' && b.content.trim()) {
    body = b.content
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((text) => ({ type: 'p' as const, text }));
  }
  return { ...b, body };
}

export const blogApi = {
  async list(query?: FetchOpts['query']) {
    const res = await get<BlogEnvelope>('/blog', { query });
    return {
      data: res.data.map(normaliseBlog),
      pagination: res.pagination,
    };
  },
  async bySlug(slug: string) {
    const res = await get<{ status: 'success'; data: RawBlog; related: RawBlog[] }>(
      `/blog/${encodeURIComponent(slug)}`,
      { revalidate: 60 }
    );
    return {
      data: normaliseBlog(res.data),
      related: (res.related ?? []).map(normaliseBlog),
    };
  },
};

// ---------- Testimonials ----------

interface Testimonial {
  _id: string;
  quote: string;
  name: string;
  role: string;
  avatar?: string;
  rating: number;
}

export const testimonialsApi = {
  async list() {
    const res = await get<{ status: 'success'; data: Testimonial[] }>('/testimonials');
    return res.data;
  },
};

// ---------- Settings ----------

export interface SiteSettings {
  brand?: { name?: string; tagline?: string; logo?: string; favicon?: string };
  contact?: {
    phone?: string; whatsapp?: string; email?: string;
    address?: string; hours?: string; mapUrl?: string;
  };
  social?: {
    instagram?: string; facebook?: string; linkedin?: string;
    youtube?: string; twitter?: string; tiktok?: string;
  };
  hero?: { videoUrl?: string; poster?: string; eyebrow?: string; title?: string; subtitle?: string };
  seo?: { defaultTitle?: string; defaultDescription?: string; ogImage?: string; gaId?: string; gtmId?: string };
  rera?: { orn?: string; license?: string; brn?: string };
}

export const settingsApi = {
  async get(): Promise<SiteSettings> {
    const res = await get<{ status: 'success'; data: SiteSettings }>('/settings');
    return res.data ?? {};
  },
};

// ---------- Generic fallback helpers ----------

/**
 * Try the API; on failure return the supplied fallback. Useful for keeping
 * dev environments green when Mongo isn't seeded yet.
 */
export async function tryOrFallback<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try { return await fn(); } catch { return fallback; }
}
