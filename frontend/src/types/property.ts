export type PropertyStatus = 'ready' | 'off-plan' | 'resale' | 'rental';
export type PropertyCategory =
  | 'apartment'
  | 'penthouse'
  | 'villa'
  | 'townhouse'
  | 'commercial'
  | 'plot';

export interface NearbyPlace {
  type: 'school' | 'hospital' | 'mall' | 'metro' | 'beach' | 'airport' | 'restaurant' | 'other';
  name: string;
  distanceKm: number;
}

export interface Agent {
  name: string;
  role?: string;
  phone: string;
  whatsapp: string;
  email?: string;
  avatar?: string;
  licenseNo?: string;
}

export interface Property {
  _id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  community: string;
  coordinates: { lat: number; lng: number };

  price: number;
  currency: 'AED' | 'USD';
  pricePerSqft?: number;
  paymentPlan?: string;

  category: PropertyCategory;
  status: PropertyStatus;

  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  parking?: number;

  developer?: string;
  handover?: string;
  yearBuilt?: number;

  cover: string;
  gallery: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  brochureUrl?: string;
  floorPlans?: { label: string; url: string }[];

  amenities: string[];
  nearby?: NearbyPlace[];
  agent?: Agent;

  featured?: boolean;
  trending?: boolean;
  newLaunch?: boolean;
  investmentScore?: number;
  roiAnnualPercent?: number;
}

export interface BlogPost {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  tags: string[];
  readMinutes: number;
  publishedAt: string;
  author: {
    name: string;
    role: string;
    bio: string;
    avatar: string;
  };
  /**
   * Article body as an ordered list of content blocks.
   * In production this is rendered from CMS rich-text JSON.
   */
  body: BlogBlock[];
}

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'quote'; text: string; attribution?: string }
  | { type: 'list'; items: string[] }
  | { type: 'image'; src: string; caption?: string };
