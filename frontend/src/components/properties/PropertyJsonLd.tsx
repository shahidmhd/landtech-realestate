import type { Property } from '@/types/property';
import { siteUrl } from '@/lib/utils';

export default function PropertyJsonLd({
  property, locale,
}: {
  property: Property; locale: string;
}) {
  const url = siteUrl(`/${locale}/properties/${property.slug}`);

  // Product/Offer schema (Google indexes property listings as Product-style)
  const listing = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: property.title,
    description: property.description,
    image: [property.cover, ...property.gallery.slice(0, 6)],
    sku: property._id,
    brand: property.developer ? { '@type': 'Brand', name: property.developer } : undefined,
    category: property.category,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: property.currency,
      price: property.price,
      availability:
        property.status === 'ready' || property.status === 'resale'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/PreOrder',
    },
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Bedrooms', value: property.bedrooms },
      { '@type': 'PropertyValue', name: 'Bathrooms', value: property.bathrooms },
      { '@type': 'PropertyValue', name: 'Area (sqft)', value: property.areaSqft },
      { '@type': 'PropertyValue', name: 'Location', value: property.location },
      { '@type': 'PropertyValue', name: 'Status', value: property.status },
    ],
  };

  // Also surface as a RealEstateListing for engines that recognise it
  const realEstate = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url,
    image: property.cover,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.location,
      addressRegion: property.community,
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: property.coordinates.lat,
      longitude: property.coordinates.lng,
    },
    numberOfRooms: property.bedrooms,
    floorSize: { '@type': 'QuantitativeValue', value: property.areaSqft, unitCode: 'FTK' },
    offers: {
      '@type': 'Offer',
      priceCurrency: property.currency,
      price: property.price,
    },
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl(`/${locale}`) },
      { '@type': 'ListItem', position: 2, name: 'Properties', item: siteUrl(`/${locale}/properties`) },
      { '@type': 'ListItem', position: 3, name: property.title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listing) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstate) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  );
}
