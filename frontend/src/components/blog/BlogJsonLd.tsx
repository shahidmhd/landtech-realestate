import type { BlogPost } from '@/types/property';
import { siteUrl } from '@/lib/utils';

export default function BlogJsonLd({
  post, locale,
}: {
  post: BlogPost; locale: string;
}) {
  const url = siteUrl(`/${locale}/blog/${post.slug}`);

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [post.cover],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
      image: post.author.avatar,
    },
    publisher: {
      '@type': 'Organization',
      name: process.env.NEXT_PUBLIC_SITE_NAME || 'Luxe Estates',
      logo: { '@type': 'ImageObject', url: siteUrl('/logo.png') },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.body.reduce((n, b) => {
      if (b.type === 'p' || b.type === 'h2' || b.type === 'h3' || b.type === 'quote') {
        return n + ('text' in b ? b.text.split(/\s+/).length : 0);
      }
      if (b.type === 'list') return n + b.items.join(' ').split(/\s+/).length;
      return n;
    }, 0),
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl(`/${locale}`) },
      { '@type': 'ListItem', position: 2, name: 'Insights', item: siteUrl(`/${locale}/blog`) },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  );
}
