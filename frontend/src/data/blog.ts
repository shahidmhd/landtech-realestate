import type { BlogPost } from '@/types/property';

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const authors = {
  research: {
    name: 'Research Desk',
    role: 'Luxe Estates Research',
    bio: 'Our in-house research team produces quarterly market notes and sector briefings used by family offices, developers and private investors across the GCC.',
    avatar: u('1573496359142-b8d87734a5a2', 400),
  },
  idris: {
    name: 'Idris Khan',
    role: 'Director · Investment Sales',
    bio: 'Models every deal on gross yield, capital appreciation and exit horizon. Previously real-estate PE in London and Singapore.',
    avatar: u('1500648767791-00dcc994a43e', 400),
  },
  layla: {
    name: 'Layla Al Hashimi',
    role: 'Advisor · Off-Plan & Branded',
    bio: 'Priority access to nearly every developer launch in Dubai. Built her book sourcing first-look opportunities for HNW clients.',
    avatar: u('1438761681033-6461ffad8d80', 400),
  },
  sarah: {
    name: 'Sarah Al Mansour',
    role: 'Senior Advisor · Prime Markets',
    bio: 'Eight years in Dubai prime. Specialises in Palm, Downtown and branded residences for international family offices.',
    avatar: u('1494790108377-be9c29b29330', 400),
  },
};

export const blogPosts: BlogPost[] = [
  {
    _id: 'b1',
    slug: 'dubai-luxury-market-q3-2026',
    title: 'Dubai Luxury Market — Q3 2026 Briefing',
    excerpt: 'Prime segment up 14% YoY. Where the smart money is moving next.',
    cover: u('1518684079-3c830dcef090'),
    category: 'Market Notes',
    tags: ['market', 'research', 'q3-2026'],
    readMinutes: 6,
    publishedAt: '2026-04-12',
    author: authors.research,
    body: [
      { type: 'p', text: 'Dubai\'s prime residential segment ended Q3 2026 up 14% year-on-year on transacted volume and 9% on average ticket size — extending a three-year streak that has now meaningfully changed the global ranking of branded-residence destinations.' },
      { type: 'p', text: 'The pattern beneath the headlines is consistent: discretionary capital from family offices, founders post-exit, and increasingly institutional vehicles continues to rotate into Dubai prime as a yield-and-residency play that is difficult to replicate elsewhere.' },
      { type: 'h2', text: 'The three drivers' },
      { type: 'list', items: [
        'Supply discipline at the top end — fewer than 90 transactions above AED 50M in the trailing twelve months, holding the segment notably tight.',
        'Off-plan launch cadence shifting toward branded residences — Bvlgari, Bulgari, Six Senses, Mandarin Oriental and Cipriani projects all priced through their reservation phases.',
        'Continued residency-driven demand under the 2024 Golden Visa thresholds, with the trailing six months showing material growth in Tier-2 European nationality buyers.',
      ]},
      { type: 'h2', text: 'Communities we are tracking' },
      { type: 'p', text: 'Palm Jumeirah villa transactions remained the firmest measure of the top end, with median achieved prices on the inner-frond plots crossing AED 6,000 per sqft for the first time. Emirates Hills similarly tightened on the sub-30,000 sqft plots, with the larger mansion footprints continuing to trade through private channels only.' },
      { type: 'quote', text: 'We have seen six off-market transactions above AED 80M in the past 90 days, none of which would have been findable on the open market.', attribution: 'Hassan Al Mansoori, Founding Partner' },
      { type: 'h2', text: 'What\'s next' },
      { type: 'p', text: 'We expect Q4 to introduce the first wave of Palm Jebel Ali resales, and continued strength in Creek Harbour and MBR City off-plan launches. For investors holding ready Downtown stock, we would consider crystallising and rotating into earlier-stage opportunities at this point in the cycle.' },
      { type: 'p', text: 'For a deeper conversation about your specific portfolio or a private viewing of any of the opportunities discussed, our advisors are happy to spend the time.' },
    ],
  },
  {
    _id: 'b2',
    slug: 'palm-jebel-ali-investor-guide',
    title: "Palm Jebel Ali — An Investor's First Look",
    excerpt: 'Reservation strategy, payment plans and the frond mathematics.',
    cover: u('1572878130352-c5c5b3e6c64f'),
    category: 'Investment',
    tags: ['off-plan', 'palm-jebel-ali', 'nakheel'],
    readMinutes: 8,
    publishedAt: '2026-03-28',
    author: authors.idris,
    body: [
      { type: 'p', text: 'When Nakheel re-launched Palm Jebel Ali in 2023, it brought to market what is, geographically, twice the developable area of Palm Jumeirah — and what is, in capital terms, the largest beach-fronted private land opportunity in Dubai for a generation.' },
      { type: 'p', text: 'For investors making their first move into the project, the temptation is to treat it as a simple beach-front villa play. It is not. Below is the framework we use with our private clients to think about which fronds, which positions, and which payment structures are likely to compound best over the next eight years.' },
      { type: 'h2', text: 'The frond mathematics' },
      { type: 'p', text: 'Palm Jebel Ali has 16 outer fronds. The first releases (A through E) sat closest to the mainland approach and were therefore most contested. The second wave (F through J) released at a sharper price-per-sqft and have since closed the gap on resale — in some cases overtaking the earlier fronds on a relative basis.' },
      { type: 'p', text: 'Our position is straightforward: the inner-frond plots on the outer arcs (positions 14 onwards on any single frond) tend to offer the strongest combination of frontage length, privacy and exit liquidity. Corner plots at the frond entrance trade well but at materially tighter beach frontage.' },
      { type: 'h2', text: 'Payment plans worth structuring around' },
      { type: 'list', items: [
        '20% on reservation, 40% during construction in 8% increments, 40% on handover — Nakheel\'s baseline structure for the early launches.',
        'Some bilateral structures we have negotiated extend the construction payments into 24 months post-handover at no premium for institutional buyers.',
        'For all-cash buyers, there is now a 4-6% discount available against the displayed payment-plan price — material on a AED 40M ticket.',
      ]},
      { type: 'quote', text: 'The biggest mistake we see is reservations made without modelling the post-handover financing exit. Plan the exit before you sign the SPA.', attribution: 'Idris Khan' },
      { type: 'p', text: 'If you are considering a Palm Jebel Ali allocation, we can model your specific ticket size, frond preference and payment structure against current resale comparables and walk through the trade-offs with you in confidence.' },
    ],
  },
  {
    _id: 'b3',
    slug: 'golden-visa-2026-changes',
    title: "Golden Visa in 2026: What's Actually Changed",
    excerpt: 'New thresholds, off-plan eligibility and how to structure your stake.',
    cover: u('1604014237800-1c9102c219da'),
    category: 'Residency',
    tags: ['golden-visa', 'residency', 'regulation'],
    readMinutes: 5,
    publishedAt: '2026-02-15',
    author: authors.layla,
    body: [
      { type: 'p', text: 'The 2026 amendments to the UAE Golden Visa programme are narrower in their published changes than the headlines suggested — but the practical effect for property-led applicants is genuinely meaningful.' },
      { type: 'h2', text: 'The headline numbers' },
      { type: 'list', items: [
        'Property investment threshold remains at AED 2 million for the standard 10-year residency.',
        'Off-plan investments from approved developers now qualify from the date of the SPA, not only on handover — a material improvement for applicants buying into 3-4 year handover windows.',
        'Joint ownership between spouses now qualifies both individuals on a single AED 2M property, where previously only the principal holder qualified.',
      ]},
      { type: 'h2', text: 'What\'s actually new' },
      { type: 'p', text: 'The most significant change is administrative: the application can now be lodged through the developer\'s liaison desk for new acquisitions, removing the previous requirement to attend in person at a federal authority office. Processing windows have correspondingly shortened from 8-12 weeks to 3-5 weeks for clean applications.' },
      { type: 'p', text: 'Mortgage-financed acquisitions remain eligible provided the equity contribution from the applicant meets the AED 2M minimum — the financed portion can sit above that without disqualifying the application.' },
      { type: 'h2', text: 'Structuring considerations' },
      { type: 'p', text: 'For clients planning a larger acquisition, we have seen growing interest in splitting the ticket across two properties to extend Golden Visa eligibility to a second family member or to optimise asset diversification. This is straightforward to structure and we are happy to walk through the mechanics with our private clients.' },
      { type: 'p', text: 'If you would like a clean read of how the 2026 changes affect your specific position, our residency desk is available for confidential consultations.' },
    ],
  },
  {
    _id: 'b4',
    slug: 'branded-residences-premium-explained',
    title: 'The Branded Residence Premium, Quantified',
    excerpt: 'Why a Bvlgari unit trades at a 60% premium to its non-branded comparable — and when that premium holds up.',
    cover: u('1600210492486-724fe5c67fb0'),
    category: 'Investment',
    tags: ['branded', 'analysis', 'prime'],
    readMinutes: 7,
    publishedAt: '2026-01-22',
    author: authors.sarah,
    body: [
      { type: 'p', text: 'Branded residences have become the defining product of Dubai\'s prime decade. Roughly 35% of new launches above AED 5 million now carry a branded operator — Bvlgari, Six Senses, Mandarin Oriental, Cipriani, Aman, Ritz-Carlton, and an expanding cast of fashion-house collaborations.' },
      { type: 'p', text: 'The structural question for any investor is straightforward: is the branded premium real, durable, and worth paying — or is it a softness that will mean-revert on resale?' },
      { type: 'h2', text: 'The premium, measured' },
      { type: 'p', text: 'Across the prime resale data we maintain, branded residences in matched comparable buildings have traded at an average premium of 47% per square foot over the last 36 months, with a range from 28% (smaller boutique brands) to 71% (a single Bvlgari outlier).' },
      { type: 'p', text: 'The premium holds up notably better on units that combine three attributes: corner orientation, full-floor or sky-level positioning, and an extended terrace footprint. Generic mid-floor branded units have shown weaker premium retention on resale.' },
      { type: 'h2', text: 'The hidden cost' },
      { type: 'p', text: 'Service charges in branded residences average roughly 35-45 AED per sqft annually, against 15-25 for high-quality non-branded comparables. On a 3,000 sqft unit that is meaningful drag — AED 60,000 - 90,000 per year in incremental holding cost.' },
      { type: 'quote', text: 'The branded premium is real, but it is most defensible at the absolute top of the building. Mid-floor branded does not carry the same conviction on the resale side.', attribution: 'Sarah Al Mansour' },
      { type: 'p', text: 'If you are considering a branded acquisition, we run building-specific comparables for our clients before any reservation. Speak to your advisor for a full premium analysis on the projects on your shortlist.' },
    ],
  },
  {
    _id: 'b5',
    slug: 'dubai-rental-yields-deep-dive',
    title: 'Dubai Rental Yields — A Community-by-Community Deep Dive',
    excerpt: 'Where the real gross yields sit in 2026, and where the data is misleading.',
    cover: u('1582268611958-ebfd161df9bf'),
    category: 'Market Notes',
    tags: ['yields', 'rental', 'data'],
    readMinutes: 9,
    publishedAt: '2025-12-08',
    author: authors.research,
    body: [
      { type: 'p', text: 'Headline gross yield figures for Dubai sit in the 6-8% band in most published research. The reality, once you separate short-let from long-let, branded from generic, and ready from off-plan, is materially more varied.' },
      { type: 'h2', text: 'Long-let yields, ready stock' },
      { type: 'p', text: 'JVC, JLT, Business Bay and Marina apartments continue to deliver the strongest pure long-let yields at 7.5-9% gross. Downtown apartments trade at sharper yields (5.5-7%) but command stronger capital appreciation as the offset.' },
      { type: 'p', text: 'On the villa side, Damac Hills and Damac Hills 2 are the standout long-let yield communities at 6.5-7.5%. Palm and Emirates Hills villas yield notably lower (3.5-5%) but trade at far better capital appreciation, and rarely make sense as a pure yield play.' },
      { type: 'h2', text: 'Short-let — where the data misleads' },
      { type: 'p', text: 'Published short-let yields can show numbers as high as 12-14% gross — but rarely net out anywhere close. After operator fees (20-25%), platform fees, service charges, maintenance, marketing void allowance and the higher furniture amortisation, the typical short-let net is 6.5-8.5% on a well-run unit.' },
      { type: 'list', items: [
        'Palm Jumeirah short-let: gross 9-11%, net 6.5-8%.',
        'Downtown short-let: gross 10-13%, net 7-9%.',
        'JVC short-let: gross 11-14%, net 7.5-10% — strongest net yields, but on smaller absolute tickets.',
      ]},
      { type: 'p', text: 'For any specific unit you are considering, we are happy to build the full income model — including realistic occupancy assumptions and net-to-gross conversion — before you commit.' },
    ],
  },
  {
    _id: 'b6',
    slug: 'investor-mistakes-dubai-first-buy',
    title: 'The Six Mistakes We See on First Dubai Acquisitions',
    excerpt: 'A short, blunt list — and how to avoid them.',
    cover: u('1542314831-068cd1dbfeeb'),
    category: 'Buying Guides',
    tags: ['first-buy', 'advisory', 'checklist'],
    readMinutes: 4,
    publishedAt: '2025-11-14',
    author: authors.idris,
    body: [
      { type: 'p', text: 'Over a decade and several thousand transactions, the mistakes are remarkably consistent. Here are the six that come up most often, and the discipline that prevents each.' },
      { type: 'h2', text: '1. Buying a yield play in a capital-appreciation community' },
      { type: 'p', text: 'Palm and Emirates Hills are not yield plays. If yield is your objective, you should be looking at JVC, JLT or selected Marina stock — not a 4% gross villa.' },
      { type: 'h2', text: '2. Ignoring service charges in the deal' },
      { type: 'p', text: 'A 5% gross yield with a 45 AED/sqft service charge is materially different from a 5% gross yield with a 15 AED/sqft service charge. The headline number lies; the net does not.' },
      { type: 'h2', text: '3. Buying off-plan without modelling the handover finance' },
      { type: 'p', text: 'A clean reservation is not a clean exit. Plan how the final 40% will be financed, refinanced or sold-through before you sign the SPA.' },
      { type: 'h2', text: '4. Mistaking floor for view' },
      { type: 'p', text: 'A 38th-floor unit with a parking-podium view trades at a discount no premium can recover. Physically verify the view before reservation.' },
      { type: 'h2', text: '5. Underestimating the developer\'s influence on resale' },
      { type: 'p', text: 'Two seemingly identical buildings can trade very differently on resale depending on the developer\'s post-handover service quality. This is a known quantity within the market — ask.' },
      { type: 'h2', text: '6. Going without an advisor on the first acquisition' },
      { type: 'p', text: 'This is not a market that rewards self-direction on the first buy. Speak to an advisor — ours or another firm — before you reserve.' },
      { type: 'p', text: 'If you are planning a first Dubai acquisition and would like to think it through carefully, we are always glad to help.' },
    ],
  },
];

export const blogCategories = Array.from(new Set(blogPosts.map((p) => p.category)));

export function findBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedBlogPosts(slug: string, limit = 3): BlogPost[] {
  const ref = findBlogPostBySlug(slug);
  if (!ref) return [];
  return blogPosts
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const aMatch = a.category === ref.category ? 1 : 0;
      const bMatch = b.category === ref.category ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, limit);
}
