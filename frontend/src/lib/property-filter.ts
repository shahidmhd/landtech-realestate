import type { Property, PropertyCategory, PropertyStatus } from '@/types/property';

export interface PropertyQuery {
  q?: string;
  location?: string;
  type?: PropertyCategory;
  status?: PropertyStatus;
  beds?: number;
  baths?: number;
  priceMin?: number;
  priceMax?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
  page?: number;
}

export const PROPERTIES_PER_PAGE = 9;

type RawParams = Record<string, string | string[] | undefined>;

export function parseQuery(sp: RawParams): PropertyQuery {
  const get = (k: string) => {
    const v = sp[k];
    if (Array.isArray(v)) return v[0];
    return v;
  };
  const num = (k: string) => {
    const v = get(k);
    if (!v) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  return {
    q: get('q') || undefined,
    location: get('location') || undefined,
    type: (get('type') as PropertyCategory) || undefined,
    status: (get('status') as PropertyStatus) || undefined,
    beds: num('beds'),
    baths: num('baths'),
    priceMin: num('priceMin') ?? parsePriceMin(get('price')),
    priceMax: num('priceMax') ?? parsePriceMax(get('price')),
    sort: (get('sort') as PropertyQuery['sort']) || undefined,
    page: num('page') || 1,
  };
}

function parsePriceMin(price?: string): number | undefined {
  if (!price) return undefined;
  const [min] = price.split('-');
  const n = Number(min);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}
function parsePriceMax(price?: string): number | undefined {
  if (!price) return undefined;
  const [, max] = price.split('-');
  const n = Number(max);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function applyFilters(items: Property[], q: PropertyQuery): Property[] {
  let out = items.slice();

  if (q.q) {
    const term = q.q.toLowerCase();
    out = out.filter((p) =>
      [p.title, p.location, p.community, p.description, p.developer]
        .filter(Boolean)
        .some((s) => String(s).toLowerCase().includes(term))
    );
  }
  if (q.location) {
    const loc = q.location.toLowerCase();
    out = out.filter(
      (p) =>
        p.location.toLowerCase().includes(loc) ||
        p.community?.toLowerCase().includes(loc)
    );
  }
  if (q.type) out = out.filter((p) => p.category === q.type);
  if (q.status) out = out.filter((p) => p.status === q.status);
  if (q.beds) out = out.filter((p) => p.bedrooms >= q.beds!);
  if (q.baths) out = out.filter((p) => p.bathrooms >= q.baths!);
  if (q.priceMin) out = out.filter((p) => p.price >= q.priceMin!);
  if (q.priceMax) out = out.filter((p) => p.price <= q.priceMax!);

  switch (q.sort) {
    case 'price-asc':
      out.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      out.sort((a, b) => b.price - a.price);
      break;
    case 'popular':
      out.sort((a, b) => (b.investmentScore ?? 0) - (a.investmentScore ?? 0));
      break;
    case 'newest':
    default:
      // featured first, then by ID (newest)
      out.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
      break;
  }
  return out;
}

export function paginate<T>(items: T[], page = 1, perPage = PROPERTIES_PER_PAGE) {
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), pages);
  const start = (current - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    total,
    pages,
    page: current,
    perPage,
  };
}

export function buildQueryString(q: Partial<PropertyQuery>): string {
  const sp = new URLSearchParams();
  Object.entries(q).forEach(([k, v]) => {
    if (v === undefined || v === '' || v === null) return;
    sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : '';
}
