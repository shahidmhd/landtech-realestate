/**
 * Seed Mongo with the same demo dataset the frontend used to ship from mock JSON.
 *
 *   npx tsx src/scripts/seed.ts             # idempotent — keeps existing if any
 *   npx tsx src/scripts/seed.ts --fresh     # wipes properties/blog/testimonials first
 *
 * Reuses the user models you've already bootstrapped — does NOT touch users.
 */

import mongoose from 'mongoose';
import slugify from 'slugify';
import { env } from '../config/env';
import { PropertyModel } from '../models/Property';
import { BlogModel } from '../models/Blog';
import { TestimonialModel } from '../models/Testimonial';
import { logger } from '../utils/logger';

const fresh = process.argv.includes('--fresh');

interface MediaSubdoc { url: string; publicId?: string; width?: number; height?: number; alt?: string }

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const sarah = { name: 'Sarah Al Mansour', role: 'Senior Advisor', phone: '+97140000001', whatsapp: '971500000001', email: 'sarah@example.com', avatar: u('1494790108377-be9c29b29330', 400), licenseNo: 'BRN 54321' };
const idris = { name: 'Idris Khan', role: 'Director · Investment Sales', phone: '+97140000002', whatsapp: '971500000002', email: 'idris@example.com', avatar: u('1500648767791-00dcc994a43e', 400), licenseNo: 'BRN 67890' };
const layla = { name: 'Layla Al Hashimi', role: 'Advisor · Off-Plan & Branded', phone: '+97140000003', whatsapp: '971500000003', email: 'layla@example.com', avatar: u('1438761681033-6461ffad8d80', 400), licenseNo: 'BRN 11223' };

const properties = [
  {
    title: 'Sky Penthouse · Burj Vista',
    description: 'A full-floor sky penthouse occupying the 62nd floor of Burj Vista, with uninterrupted views of the Burj Khalifa and the Dubai Fountain. Custom Italian interiors by Studio Forme, private elevator access, and a wraparound terrace built for entertaining at altitude.',
    location: 'Downtown Dubai', community: 'Burj Vista',
    coordinates: { lat: 25.1956, lng: 55.2742 },
    price: 24500000, currency: 'AED' as const, pricePerSqft: 3950, paymentPlan: '100% on transfer',
    category: 'penthouse' as const, status: 'ready' as const,
    bedrooms: 4, bathrooms: 5, areaSqft: 6200, parking: 3, developer: 'Emaar', yearBuilt: 2021,
    cover: u('1600585154340-be6161a56a0c'),
    gallery: [u('1600585154340-be6161a56a0c'), u('1600566753190-17f0baa2a6c3'), u('1600210492486-724fe5c67fb0'), u('1600607687939-ce8a6c25118c'), u('1600121848594-d8644e57abab'), u('1556909114-f6e7ad7d3136'), u('1600596542815-ffad4c1539a9')].map((url) => ({ url } as MediaSubdoc)),
    amenities: ['Burj Khalifa view', 'Private elevator', 'Smart home', 'Wine cellar', 'Wraparound terrace', 'Concierge', '3 parking bays', 'Staff quarters'],
    nearby: [
      { type: 'mall', name: 'The Dubai Mall', distanceKm: 0.4 },
      { type: 'metro', name: 'Burj Khalifa Metro', distanceKm: 0.7 },
      { type: 'school', name: 'GEMS Wellington Primary', distanceKm: 2.1 },
      { type: 'hospital', name: 'Emirates Hospital Clinics', distanceKm: 1.8 },
    ],
    agent: sarah, featured: true, trending: true, published: true,
    investmentScore: 88, roiAnnualPercent: 6.4,
  },
  {
    title: 'Signature Beachfront Villa',
    description: 'A signature six-bedroom mansion on the inner curve of the Palm with 100ft of private shoreline, an infinity pool that disappears into the Arabian Gulf, and a full subterranean wellness floor with cinema, gym, hammam and wine room.',
    location: 'Palm Jumeirah', community: 'Frond M',
    coordinates: { lat: 25.1124, lng: 55.139 },
    price: 68000000, currency: 'AED' as const, pricePerSqft: 5483,
    category: 'villa' as const, status: 'ready' as const,
    bedrooms: 6, bathrooms: 8, areaSqft: 12400, parking: 6, developer: 'Nakheel', yearBuilt: 2019,
    cover: u('1613977257363-707ba9348227'),
    gallery: [u('1613977257363-707ba9348227'), u('1600596542815-ffad4c1539a9'), u('1570129477492-45c003edd2be'), u('1564013799919-ab600027ffc6'), u('1599809275671-b5942cabc7a2'), u('1582268611958-ebfd161df9bf'), u('1600210492486-724fe5c67fb0')].map((url) => ({ url } as MediaSubdoc)),
    amenities: ['Private beach (100ft)', 'Infinity pool', 'Cinema', 'Gym', 'Hammam', 'Wine room', 'Staff quarters', 'Garage (6)', 'Smart home', 'Outdoor kitchen', 'Cabana lounge', 'Maids room'],
    nearby: [
      { type: 'beach', name: 'Private beach access', distanceKm: 0 },
      { type: 'mall', name: 'Nakheel Mall', distanceKm: 1.2 },
      { type: 'school', name: 'Dubai College', distanceKm: 6.4 },
      { type: 'airport', name: 'DXB International', distanceKm: 28 },
    ],
    agent: idris, featured: true, published: true,
    investmentScore: 92, roiAnnualPercent: 5.8,
  },
  {
    title: 'Marina Bay Residence',
    description: 'A higher-floor three-bed apartment in the Marina Gate complex with a full marina-arc view and an exceptional layout — generous reception, three en-suite bedrooms, and a study that could serve as a fourth.',
    location: 'Dubai Marina', community: 'Marina Gate',
    coordinates: { lat: 25.0772, lng: 55.1383 },
    price: 4900000, currency: 'AED' as const, pricePerSqft: 2279,
    category: 'apartment' as const, status: 'ready' as const,
    bedrooms: 3, bathrooms: 4, areaSqft: 2150, parking: 2, developer: 'Select Group', yearBuilt: 2020,
    cover: u('1545324418-cc1a3fa10c00'),
    gallery: [u('1545324418-cc1a3fa10c00'), u('1600121848594-d8644e57abab'), u('1600566753190-17f0baa2a6c3'), u('1505691938895-1758d7feb511'), u('1600210492486-724fe5c67fb0'), u('1600607687939-ce8a6c25118c')].map((url) => ({ url } as MediaSubdoc)),
    amenities: ['Marina view', 'Concierge', 'Pool deck', 'Gym', '2 parking', 'Study room', 'Floor-to-ceiling glass', 'Walk-in wardrobe'],
    nearby: [
      { type: 'metro', name: 'DMCC Metro', distanceKm: 0.8 },
      { type: 'mall', name: 'Marina Mall', distanceKm: 0.5 },
      { type: 'beach', name: 'JBR Beach', distanceKm: 1.4 },
      { type: 'restaurant', name: 'Pier 7', distanceKm: 0.6 },
    ],
    agent: sarah, featured: true, trending: true, published: true,
    investmentScore: 79, roiAnnualPercent: 7.2,
  },
  {
    title: 'Emirates Hills Mansion',
    description: 'A custom-built mansion on a lakefront plot in Sector W of Emirates Hills. Seven bedrooms, a private spa floor, indoor and outdoor pools, full service quarters and a 24-car private gallery.',
    location: 'Emirates Hills', community: 'Sector W',
    coordinates: { lat: 25.0717, lng: 55.1648 },
    price: 95000000, currency: 'AED' as const, pricePerSqft: 3958,
    category: 'villa' as const, status: 'resale' as const,
    bedrooms: 7, bathrooms: 9, areaSqft: 24000, parking: 24, yearBuilt: 2018,
    cover: u('1600596542815-ffad4c1539a9'),
    gallery: [u('1600596542815-ffad4c1539a9'), u('1613977257363-707ba9348227'), u('1564013799919-ab600027ffc6'), u('1572878130352-c5c5b3e6c64f'), u('1600585154340-be6161a56a0c'), u('1542314831-068cd1dbfeeb')].map((url) => ({ url } as MediaSubdoc)),
    amenities: ['Lake view', 'Private spa', 'Indoor pool', 'Outdoor pool', 'Wine cellar', 'Cinema', 'Driver quarters', 'Maids quarters', '24-car gallery', 'Tennis-ready garden', 'Golf-front'],
    nearby: [
      { type: 'school', name: 'Dubai International Academy', distanceKm: 0.9 },
      { type: 'mall', name: 'Mall of the Emirates', distanceKm: 4.2 },
      { type: 'metro', name: 'Mashreq Metro', distanceKm: 3.4 },
    ],
    agent: idris, featured: true, published: true,
    investmentScore: 85, roiAnnualPercent: 4.9,
  },
  {
    title: 'Pearl Tower · Creek Harbour',
    description: 'A launch-priced two-bedroom apartment on the Creek Beach with a Burj Khalifa skyline orientation and a 40/60 payment plan. Hand over Q4 2027.',
    location: 'Dubai Creek Harbour', community: 'Creek Beach',
    coordinates: { lat: 25.1969, lng: 55.346 },
    price: 2750000, currency: 'AED' as const, pricePerSqft: 1993, paymentPlan: '40% during / 60% on handover',
    category: 'apartment' as const, status: 'off-plan' as const,
    bedrooms: 2, bathrooms: 3, areaSqft: 1380, parking: 1, developer: 'Emaar', handover: 'Q4 2027',
    cover: u('1582268611958-ebfd161df9bf'),
    gallery: [u('1582268611958-ebfd161df9bf'), u('1545324418-cc1a3fa10c00'), u('1600121848594-d8644e57abab'), u('1600210492486-724fe5c67fb0'), u('1505691938895-1758d7feb511')].map((url) => ({ url } as MediaSubdoc)),
    amenities: ['Beach access', 'Skyline view', '40/60 payment plan', 'Branded amenities', 'Pool deck', 'Kids zone', 'Co-working lounge', 'Retail at ground floor'],
    nearby: [
      { type: 'beach', name: 'Creek Beach (private)', distanceKm: 0.1 },
      { type: 'metro', name: 'Creek Metro (planned)', distanceKm: 1.2 },
      { type: 'mall', name: 'Creek Marina Retail', distanceKm: 0.7 },
    ],
    agent: layla, featured: true, newLaunch: true, published: true,
    investmentScore: 91, roiAnnualPercent: 8.3,
  },
  {
    title: 'Bvlgari Residence',
    description: 'A three-bedroom apartment in the Bvlgari residences on Jumeirah Bay Island, with full marina-front views, a 24-hour Bvlgari concierge, and one of the most coveted addresses in Dubai.',
    location: 'Jumeirah Bay Island', community: 'Bvlgari',
    coordinates: { lat: 25.1972, lng: 55.2389 },
    price: 19500000, currency: 'AED' as const, pricePerSqft: 5065,
    category: 'apartment' as const, status: 'ready' as const,
    bedrooms: 3, bathrooms: 4, areaSqft: 3850, parking: 2, developer: 'Meraas', yearBuilt: 2020,
    cover: u('1600607687939-ce8a6c25118c'),
    gallery: [u('1600607687939-ce8a6c25118c'), u('1600566753190-17f0baa2a6c3'), u('1600121848594-d8644e57abab'), u('1505691938895-1758d7feb511'), u('1600210492486-724fe5c67fb0'), u('1545324418-cc1a3fa10c00')].map((url) => ({ url } as MediaSubdoc)),
    amenities: ['Branded residence', 'Private beach', 'Marina berth', 'Bvlgari concierge', 'Yacht club', 'Spa', 'Cigar lounge', '2 parking bays'],
    nearby: [
      { type: 'beach', name: 'Bvlgari private beach', distanceKm: 0 },
      { type: 'mall', name: 'City Walk', distanceKm: 5.6 },
      { type: 'restaurant', name: 'Il Café di Roma', distanceKm: 0.1 },
    ],
    agent: sarah, featured: true, trending: true, published: true,
    investmentScore: 94, roiAnnualPercent: 5.5,
  },
  {
    title: 'Business Bay Skyline Loft',
    description: 'A double-height loft apartment with full-glass Burj Khalifa elevation. Two bedrooms, mezzanine study, and a 14ft ceiling reception built for an art collection.',
    location: 'Business Bay', community: 'Volante',
    coordinates: { lat: 25.1843, lng: 55.2587 },
    price: 3600000, currency: 'AED' as const, pricePerSqft: 2118,
    category: 'apartment' as const, status: 'resale' as const,
    bedrooms: 2, bathrooms: 3, areaSqft: 1700, parking: 2, developer: 'Damac', yearBuilt: 2019,
    cover: u('1505691938895-1758d7feb511'),
    gallery: [u('1505691938895-1758d7feb511'), u('1600121848594-d8644e57abab'), u('1545324418-cc1a3fa10c00'), u('1600566753190-17f0baa2a6c3'), u('1600210492486-724fe5c67fb0')].map((url) => ({ url } as MediaSubdoc)),
    amenities: ['Burj Khalifa view', 'Double-height ceiling', 'Mezzanine study', 'Floor-to-ceiling glass', '2 parking', 'Concierge', 'Pool & gym'],
    nearby: [
      { type: 'metro', name: 'Business Bay Metro', distanceKm: 0.4 },
      { type: 'mall', name: 'Bay Avenue', distanceKm: 0.3 },
      { type: 'restaurant', name: 'Zuma', distanceKm: 1.8 },
    ],
    agent: idris, published: true,
    investmentScore: 76, roiAnnualPercent: 7.8,
  },
  {
    title: 'Al Barari Eco-Estate',
    description: "A five-bedroom villa set within Al Barari's botanical landscape — 60% green coverage, themed gardens, and a private lap pool. Quiet luxury, three minutes from school runs.",
    location: 'Al Barari', community: 'The Reserve',
    coordinates: { lat: 25.106, lng: 55.293 },
    price: 28500000, currency: 'AED' as const, pricePerSqft: 3357,
    category: 'villa' as const, status: 'ready' as const,
    bedrooms: 5, bathrooms: 7, areaSqft: 8490, parking: 4, developer: 'Al Barari', yearBuilt: 2022,
    cover: u('1564013799919-ab600027ffc6'),
    gallery: [u('1564013799919-ab600027ffc6'), u('1600596542815-ffad4c1539a9'), u('1572878130352-c5c5b3e6c64f'), u('1542314831-068cd1dbfeeb'), u('1518684079-3c830dcef090')].map((url) => ({ url } as MediaSubdoc)),
    amenities: ['Botanical gardens', 'Lap pool', 'Smart home', 'Staff quarters', 'Private courtyard', 'Outdoor lounge', 'Wellness room'],
    nearby: [
      { type: 'school', name: 'Repton Dubai', distanceKm: 1.6 },
      { type: 'hospital', name: 'Mediclinic Parkview', distanceKm: 3.2 },
      { type: 'restaurant', name: 'The Farm', distanceKm: 0.4 },
    ],
    agent: layla, published: true,
    investmentScore: 81, roiAnnualPercent: 5.1,
  },
  {
    title: 'Index Tower · Grade-A Office',
    description: 'A fully-fitted 5,400 sqft Grade-A office on the 38th floor of Index Tower, DIFC — partitioned for 30+ workstations, two executive offices, and a boardroom with skyline views.',
    location: 'DIFC', community: 'Index Tower',
    coordinates: { lat: 25.2114, lng: 55.2807 },
    price: 12800000, currency: 'AED' as const, pricePerSqft: 2370,
    category: 'commercial' as const, status: 'ready' as const,
    bedrooms: 0, bathrooms: 2, areaSqft: 5400, parking: 6, developer: 'Union Properties', yearBuilt: 2011,
    cover: u('1486406146926-c627a92ad1ab'),
    gallery: [u('1486406146926-c627a92ad1ab'), u('1497366216548-37526070297c'), u('1497215842964-222b430dc094'), u('1497366811353-6870744d04b2')].map((url) => ({ url } as MediaSubdoc)),
    amenities: ['Grade-A finish', 'Boardroom', '30+ workstations', '2 executive offices', '6 parking', 'DEWA & chiller', '24/7 access', 'Reception area'],
    nearby: [
      { type: 'metro', name: 'Emirates Towers Metro', distanceKm: 0.5 },
      { type: 'restaurant', name: 'Zuma', distanceKm: 0.3 },
    ],
    agent: idris, published: true,
    investmentScore: 73, roiAnnualPercent: 7.5,
  },
  {
    title: 'Damac Hills Corner Villa',
    description: 'A four-bedroom corner villa overlooking the Trump International Golf Course. South-facing garden, plunge pool, and a layout that maximises light through every room.',
    location: 'Damac Hills', community: 'Rockwood',
    coordinates: { lat: 25.0264, lng: 55.2549 },
    price: 6450000, currency: 'AED' as const, pricePerSqft: 1742,
    category: 'townhouse' as const, status: 'resale' as const,
    bedrooms: 4, bathrooms: 5, areaSqft: 3700, parking: 2, developer: 'Damac', yearBuilt: 2020,
    cover: u('1599809275671-b5942cabc7a2'),
    gallery: [u('1599809275671-b5942cabc7a2'), u('1564013799919-ab600027ffc6'), u('1572878130352-c5c5b3e6c64f'), u('1518684079-3c830dcef090'), u('1542314831-068cd1dbfeeb')].map((url) => ({ url } as MediaSubdoc)),
    amenities: ['Golf view', 'Plunge pool', 'Smart home', 'South-facing garden', 'Corner plot', 'Maids room', 'BBQ deck'],
    nearby: [
      { type: 'school', name: 'Jebel Ali School', distanceKm: 3.1 },
      { type: 'mall', name: 'First Avenue Mall', distanceKm: 1.4 },
    ],
    agent: sarah, published: true,
    investmentScore: 78, roiAnnualPercent: 6.9,
  },
  {
    title: 'District One Mansion',
    description: 'A contemporary six-bedroom mansion on the largest crystal lagoon in MBR City, with a private beach, full home automation by Crestron, and a basement leisure floor.',
    location: 'MBR City', community: 'District One',
    coordinates: { lat: 25.1689, lng: 55.3115 },
    price: 52000000, currency: 'AED' as const, pricePerSqft: 4727,
    category: 'villa' as const, status: 'ready' as const,
    bedrooms: 6, bathrooms: 8, areaSqft: 11000, parking: 5, developer: 'Meydan Sobha', yearBuilt: 2022,
    cover: u('1572878130352-c5c5b3e6c64f'),
    gallery: [u('1572878130352-c5c5b3e6c64f'), u('1613977257363-707ba9348227'), u('1600596542815-ffad4c1539a9'), u('1564013799919-ab600027ffc6'), u('1599809275671-b5942cabc7a2'), u('1542314831-068cd1dbfeeb')].map((url) => ({ url } as MediaSubdoc)),
    amenities: ['Crystal lagoon access', 'Private beach', 'Crestron automation', 'Basement leisure', 'Cinema', 'Wine room', 'Outdoor lounge', 'Staff quarters', 'Garage (5)'],
    nearby: [
      { type: 'beach', name: 'Crystal Lagoon', distanceKm: 0 },
      { type: 'school', name: 'Hartland International', distanceKm: 1.8 },
      { type: 'mall', name: 'Meydan Mall', distanceKm: 2.4 },
    ],
    agent: idris, featured: true, published: true,
    investmentScore: 89, roiAnnualPercent: 5.6,
  },
  {
    title: 'Palm Jebel Ali · Frond Launch',
    description: 'Reservation-grade access to a beachfront frond plot on the relaunched Palm Jebel Ali. Six-bed mansion footprint, 75ft beach frontage, handover Q1 2028.',
    location: 'Palm Jebel Ali', community: 'Frond E',
    coordinates: { lat: 24.999, lng: 55.04 },
    price: 38000000, currency: 'AED' as const, pricePerSqft: 3450, paymentPlan: '20/40/40 (20% down · 40% construction · 40% handover)',
    category: 'villa' as const, status: 'off-plan' as const,
    bedrooms: 6, bathrooms: 7, areaSqft: 11000, parking: 4, developer: 'Nakheel', handover: 'Q1 2028',
    cover: u('1542314831-068cd1dbfeeb'),
    gallery: [u('1542314831-068cd1dbfeeb'), u('1613977257363-707ba9348227'), u('1572878130352-c5c5b3e6c64f'), u('1564013799919-ab600027ffc6'), u('1599809275671-b5942cabc7a2')].map((url) => ({ url } as MediaSubdoc)),
    amenities: ['75ft beach frontage', 'Frond plot', 'Smart home pre-wired', 'Lap pool', '6-bed footprint', '20/40/40 plan', 'Handover 2028'],
    nearby: [
      { type: 'beach', name: 'Private beach (planned)', distanceKm: 0 },
      { type: 'mall', name: 'Ibn Battuta Mall', distanceKm: 14 },
      { type: 'airport', name: 'Al Maktoum International', distanceKm: 22 },
    ],
    agent: layla, newLaunch: true, published: true,
    investmentScore: 95, roiAnnualPercent: 8.9,
  },
];

const blogs = [
  {
    title: 'Dubai Luxury Market — Q3 2026 Briefing',
    excerpt: 'Prime segment up 14% YoY. Where the smart money is moving next.',
    cover: u('1518684079-3c830dcef090', 1200),
    category: 'Market Notes',
    tags: ['market', 'research', 'q3-2026'],
    readMinutes: 6,
    publishedAt: new Date('2026-04-12'),
    author: { name: 'Research Desk', bio: 'In-house research team.', avatar: u('1573496359142-b8d87734a5a2', 400) },
    content: '[]',
    published: true,
  },
  {
    title: "Palm Jebel Ali — An Investor's First Look",
    excerpt: 'Reservation strategy, payment plans and the frond mathematics.',
    cover: u('1572878130352-c5c5b3e6c64f', 1200),
    category: 'Investment',
    tags: ['off-plan', 'palm-jebel-ali', 'nakheel'],
    readMinutes: 8,
    publishedAt: new Date('2026-03-28'),
    author: { name: 'Idris Khan', bio: 'Director · Investment Sales', avatar: u('1500648767791-00dcc994a43e', 400) },
    content: '[]',
    published: true,
  },
  {
    title: "Golden Visa in 2026: What's Actually Changed",
    excerpt: 'New thresholds, off-plan eligibility and how to structure your stake.',
    cover: u('1604014237800-1c9102c219da', 1200),
    category: 'Residency',
    tags: ['golden-visa', 'residency', 'regulation'],
    readMinutes: 5,
    publishedAt: new Date('2026-02-15'),
    author: { name: 'Layla Al Hashimi', bio: 'Advisor · Off-Plan & Branded', avatar: u('1438761681033-6461ffad8d80', 400) },
    content: '[]',
    published: true,
  },
];

const testimonials = [
  { quote: "From sourcing to handover, the team operated at a level I haven't seen anywhere else in Dubai. Three transactions in, and they remain my first call.", name: 'H. Al Mansoori', role: 'Family Office Principal', rating: 5, order: 1, published: true },
  { quote: 'They turned a 14-month off-plan acquisition into a refinanced, leased and cash-flowing asset before completion. Outstanding.', name: 'Priya R.', role: 'Private Investor, London', rating: 5, order: 2, published: true },
  { quote: 'We mandate them on every Palm and Emirates Hills brief. The judgment and discretion are exactly what our clients require.', name: 'Markus W.', role: 'Swiss Wealth Manager', rating: 5, order: 3, published: true },
];

async function run() {
  await mongoose.connect(env.MONGODB_URI);
  logger.info(`Connected to ${mongoose.connection.host}`);

  if (fresh) {
    await Promise.all([
      PropertyModel.deleteMany({}),
      BlogModel.deleteMany({}),
      TestimonialModel.deleteMany({}),
    ]);
    logger.info('Cleared properties / blog / testimonials.');
  }

  // Properties — upsert by slug
  for (const p of properties) {
    const slug = slugify(p.title, { lower: true, strict: true });
    await PropertyModel.updateOne(
      { slug },
      { $set: { ...p, slug } },
      { upsert: true }
    );
  }
  logger.info(`Upserted ${properties.length} properties.`);

  for (const b of blogs) {
    const slug = slugify(b.title, { lower: true, strict: true });
    await BlogModel.updateOne(
      { slug },
      { $set: { ...b, slug } },
      { upsert: true }
    );
  }
  logger.info(`Upserted ${blogs.length} blog posts.`);

  for (const t of testimonials) {
    await TestimonialModel.updateOne(
      { name: t.name, order: t.order },
      { $set: t },
      { upsert: true }
    );
  }
  logger.info(`Upserted ${testimonials.length} testimonials.`);

  await mongoose.disconnect();
  logger.info('Done.');
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
