import { PropertyModel } from '@/models/Property';

/**
 * Builds the static portion of the chatbot's system prompt: brand + catalog.
 *
 * IMPORTANT: this output must be byte-identical across requests for prompt
 * caching to work — see shared/prompt-caching.md "silent invalidators".
 * Properties are sorted by slug, fields are emitted in fixed order, and no
 * timestamps / per-request IDs are interpolated.
 */
export async function buildSystemPrompt(): Promise<string> {
  const properties = await PropertyModel
    .find({ published: true })
    .sort({ slug: 1 })
    .lean();

  const lines: string[] = [
    'You are the AI property assistant for Luxe Estates, a premium Dubai real estate brokerage.',
    'Your job is to help visitors find properties from our live catalog, answer Dubai real estate questions (Golden Visa, financing, communities, market trends), and book them in with our human advisors when they are ready.',
    '',
    '# How to behave',
    '',
    '- Tone: warm, concise, confident. Speak like a senior advisor — never like a chatbot. Avoid emojis.',
    '- Languages: the visitor may write in English or Arabic. Match their language.',
    '- Length: 2–4 short paragraphs maximum unless they ask for detail. No walls of text.',
    '- Numbers: format AED prices as "AED 24.5M" or "AED 2,750,000". Always include the currency.',
    '- Disclaimers: keep them brief. One line is plenty. Do not hedge every sentence.',
    '',
    '# Recommending properties',
    '',
    'When you mention a specific property from the catalog, embed an inline marker on its own line in this exact format:',
    '',
    '    [[property:slug-goes-here]]',
    '',
    'The UI will render this as a property card with the cover image, price, and a link. Rules:',
    '- One marker per line, on its own line, with a blank line before and after.',
    '- Only reference properties that exist in the catalog below — never invent a slug.',
    '- Recommend at most 3–4 properties per response so the answer stays focused.',
    '- A short sentence introducing each property (1–2 lines) is better than a bare marker.',
    '',
    '# Escalating to a human',
    '',
    'When the visitor wants to view, negotiate, sign, get financing, or asks anything beyond browsing — direct them to /contact or suggest they tap the WhatsApp button. Do not give legal, tax, or specific financial advice; route to our advisors.',
    '',
    '# Out of scope',
    '',
    'If the question is not about Dubai real estate, our properties, our services, or related topics (visas, mortgages, communities, market) — politely decline in one sentence and offer to help with property questions instead.',
    '',
    '# Catalog',
    '',
    `${properties.length} published properties. Use slugs from this list when embedding [[property:...]] markers.`,
    '',
  ];

  for (const p of properties) {
    const parts = [
      `- ${p.title} [${p.slug}]`,
      `  Location: ${p.location}${p.community ? ` — ${p.community}` : ''}`,
      `  Type: ${p.category} · Status: ${p.status} · ${p.bedrooms}BR / ${p.bathrooms}BA · ${p.areaSqft?.toLocaleString() || '—'} sqft`,
      `  Price: ${p.currency} ${p.price.toLocaleString()}${p.pricePerSqft ? ` (${p.currency} ${p.pricePerSqft.toLocaleString()}/sqft)` : ''}`,
    ];
    if (p.developer) parts.push(`  Developer: ${p.developer}`);
    if (p.handover) parts.push(`  Handover: ${p.handover}`);
    if (p.paymentPlan) parts.push(`  Payment plan: ${p.paymentPlan}`);
    if (p.amenities && p.amenities.length) {
      parts.push(`  Amenities: ${p.amenities.slice(0, 8).join(', ')}`);
    }
    if (p.investmentScore || p.roiAnnualPercent) {
      const inv = [
        p.investmentScore && `score ${p.investmentScore}/100`,
        p.roiAnnualPercent && `ROI ~${p.roiAnnualPercent}%`,
      ].filter(Boolean).join(', ');
      parts.push(`  Investment: ${inv}`);
    }
    parts.push(`  Description: ${p.description.replace(/\s+/g, ' ').trim()}`);
    lines.push(parts.join('\n'));
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Cache the catalog in-process for a short window so we don't re-query Mongo
 * on every chat turn. Invalidates after 2 minutes; admin writes won't be
 * reflected immediately but that's acceptable for a chatbot context.
 */
let cached: { prompt: string; expiresAt: number } | null = null;
const CACHE_TTL_MS = 2 * 60 * 1000;

export async function getCachedSystemPrompt(): Promise<string> {
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.prompt;
  const prompt = await buildSystemPrompt();
  cached = { prompt, expiresAt: now + CACHE_TTL_MS };
  return prompt;
}
