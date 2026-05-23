import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';
import { properties } from '@/data/properties';
import { blogPosts } from '@/data/blog';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = [
    '', '/properties', '/services', '/projects', '/about', '/blog', '/contact',
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${BASE}/${locale}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${BASE}/${l}${path}`])
        ),
      },
    }))
  );

  const propertyEntries: MetadataRoute.Sitemap = properties.flatMap((p) =>
    locales.map((locale) => ({
      url: `${BASE}/${locale}/properties/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }))
  );

  const blogEntries: MetadataRoute.Sitemap = blogPosts.flatMap((b) =>
    locales.map((locale) => ({
      url: `${BASE}/${locale}/blog/${b.slug}`,
      lastModified: new Date(b.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  return [...staticEntries, ...propertyEntries, ...blogEntries];
}
