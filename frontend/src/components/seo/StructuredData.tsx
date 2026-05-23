import { siteUrl } from '@/lib/utils';

export default function StructuredData({ locale }: { locale: string }) {
  const url = siteUrl(`/${locale}`);
  const name = process.env.NEXT_PUBLIC_SITE_NAME || 'Luxe Estates';

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${siteUrl('/')}#org`,
    name,
    url,
    logo: siteUrl('/logo.png'),
    image: siteUrl('/og-default.jpg'),
    telephone: process.env.NEXT_PUBLIC_PHONE_NUMBER || '+97140000000',
    email: process.env.NEXT_PUBLIC_EMAIL || 'info@example.com',
    priceRange: 'AED 1M – AED 500M',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Level 42, Burj Daman, DIFC',
      addressLocality: 'Dubai',
      addressCountry: 'AE',
    },
    areaServed: { '@type': 'Place', name: 'Dubai, United Arab Emirates' },
    sameAs: [
      'https://instagram.com',
      'https://facebook.com',
      'https://linkedin.com',
      'https://youtube.com',
    ],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl('/properties')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
