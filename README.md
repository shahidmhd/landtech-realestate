# Luxe Estates — Dubai Real Estate Platform

Premium, ultra-modern real estate website with a fully dynamic backend and admin-ready data layer.

- **Frontend:** Next.js 15 (App Router) · TypeScript · Tailwind · Framer Motion · GSAP-ready · next-intl (EN + AR/RTL)
- **Backend:** Node.js · Express · TypeScript · MongoDB (Mongoose) · JWT · Cloudinary
- **SEO:** Dynamic metadata, OG/Twitter cards, JSON-LD (Organization, WebSite, FAQPage), sitemap, robots
- **Deployment:** Vercel (frontend) · VPS/Render/Railway (backend) · MongoDB Atlas

---

## Project structure

```
realestate/
├── frontend/                 Next.js 15 app (App Router, i18n via [locale])
│   ├── src/
│   │   ├── app/[locale]/     localized routes
│   │   ├── components/       layout, home sections, SEO
│   │   ├── i18n/             routing + request config
│   │   ├── messages/         en.json, ar.json
│   │   ├── data/             mock data (replace with API calls)
│   │   ├── lib/, hooks/, types/, styles/
│   │   └── middleware.ts     next-intl middleware
│   ├── tailwind.config.ts    luxury black/gold/ivory theme
│   ├── next.config.mjs       images, headers, next-intl plugin
│   └── .env.example
│
├── backend/                  Express + Mongo API
│   ├── src/
│   │   ├── config/           env, db, cloudinary
│   │   ├── models/           Property, Blog, User, Inquiry, Testimonial, Settings, Service
│   │   ├── controllers/      property, auth, inquiry
│   │   ├── routes/           v1 router + module routes
│   │   ├── middleware/       auth, validate, errorHandler
│   │   ├── utils/            logger, mailer, AppError, catchAsync
│   │   ├── app.ts            express app factory
│   │   └── server.ts         bootstrap
│   └── .env.example
│
└── README.md
```

---

## Quick start

### 1. Prerequisites
- Node.js 20.x or 22.x
- MongoDB (local) or a MongoDB Atlas connection string
- (Optional) Cloudinary account for media uploads

### 2. Install

```bash
# frontend
cd frontend
cp .env.example .env.local
npm install

# backend
cd ../backend
cp .env.example .env
npm install
```

### 3. Run dev servers

Open two terminals:

```bash
# backend → http://localhost:5000/api/v1/health
cd backend && npm run dev

# frontend → http://localhost:3000 (EN) and http://localhost:3000/ar (AR/RTL)
cd frontend && npm run dev
```

### 4. Build for production

```bash
# frontend
cd frontend && npm run build && npm start

# backend
cd backend && npm run build && npm start
```

---

## Environment variables

### `frontend/.env.local`

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL — used for SEO/OG/sitemap |
| `NEXT_PUBLIC_SITE_NAME` | Brand name in `<title>` and JSON-LD |
| `NEXT_PUBLIC_API_URL` | Backend API base (e.g. `https://api.example.com/api/v1`) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | For direct delivery URLs |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | International format, no `+` (e.g. `971500000000`) |
| `NEXT_PUBLIC_PHONE_NUMBER` | Display + `tel:` link |
| `NEXT_PUBLIC_EMAIL` | Public email |
| `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GTM_ID` | Analytics |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Maps embed on property + contact pages |

### `backend/.env`

| Variable | Purpose |
|---|---|
| `NODE_ENV`, `PORT`, `API_PREFIX` | Runtime |
| `MONGODB_URI` | Mongo connection string (required) |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Access token signing |
| `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES_IN` | Refresh token signing |
| `CLOUDINARY_*` | Upload + delivery |
| `CORS_ORIGINS` | Comma-separated allowed origins |
| `SMTP_*`, `MAIL_FROM`, `MAIL_TO_LEADS` | Lead notification emails (optional) |
| `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX` | Rate limiting |

> **Tip:** generate JWT secrets with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.

---

## API surface (v1)

Base: `${API_PREFIX}` (default `/api/v1`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | — | Liveness probe |
| POST | `/auth/register` | — | Register user |
| POST | `/auth/login` | — | Login → access + refresh tokens |
| GET | `/auth/me` | bearer | Current user |
| GET | `/properties` | — | List + filter (q, location, category, status, beds, baths, priceMin/Max, sort, page, limit) |
| GET | `/properties/featured` | — | Featured carousel |
| GET | `/properties/:slug` | — | Detail (increments views, returns `similar`) |
| POST | `/properties` | admin/editor | Create |
| PATCH | `/properties/:id` | admin/editor | Update |
| DELETE | `/properties/:id` | admin/editor | Delete |
| GET | `/blog`, `/blog/:slug` | — | List + detail |
| POST/PATCH/DELETE | `/blog/...` | admin/editor | Manage |
| POST | `/inquiries` | — | Submit lead (validated, mailed) |
| GET/PATCH | `/inquiries[...]` | admin/editor/broker | CRM |
| POST | `/newsletter` | — | Subscribe |
| GET | `/testimonials` | — | List published |
| POST/PATCH/DELETE | `/testimonials[...]` | admin/editor | Manage |
| GET | `/settings` | — | Global settings (homepage sections, contact, social) |
| PUT | `/settings` | admin | Update settings |
| POST | `/uploads` | admin/editor | Multi-file Cloudinary upload |
| DELETE | `/uploads/:publicId` | admin/editor | Remove asset |

---

## Internationalization

- Locales: `en` (default), `ar` (RTL)
- URL pattern: `/`, `/ar` (English is `as-needed` — no prefix for default locale)
- Translation files: `frontend/src/messages/{en,ar}.json`
- RTL handled at the `<html dir>` level + Tailwind `rtl:` variants
- Locale switcher in the header preserves the current path

---

## SEO checklist (already wired)

- Dynamic `generateMetadata` with `metadataBase`, canonical, `hreflang` alternates
- Open Graph + Twitter `summary_large_image`
- JSON-LD: `RealEstateAgent`, `WebSite` (with `SearchAction`), `FAQPage`
- `sitemap.ts` includes static, property, and blog URLs in both locales
- `robots.ts` disallows `/api`, `/admin`
- `next/image` with AVIF/WebP, blur placeholders supported on Cloudinary
- Security headers via `next.config.mjs`

---

## Deployment

### Frontend → Vercel
1. Import the `frontend/` directory as the project root.
2. Add the env vars from `.env.example` in the Vercel dashboard.
3. Set `NEXT_PUBLIC_API_URL` to the deployed backend URL.

### Backend → VPS / Render / Railway / Fly
1. Set env vars (esp. `MONGODB_URI`, `JWT_SECRET*`, `CORS_ORIGINS`).
2. `npm run build && npm start` — or use the project's process manager (pm2, systemd).
3. Reverse-proxy via nginx/Caddy with TLS; forward `/api/*` to `:4000`.

### MongoDB → Atlas
1. Create a project + cluster (M10+ recommended for prod).
2. Add the deploy IP / `0.0.0.0/0` to the IP allowlist (use VPC peering in prod).
3. Use the SRV connection string for `MONGODB_URI`.

### Cloudinary
1. Create a product environment + an upload preset.
2. Provide `CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET` to the backend.
3. Frontend uses `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` only (delivery URLs).

---

## AI property assistant (chatbot)

A floating chat widget on every public page, powered by **Google Gemini** through Google AI Studio. The widget streams responses over SSE and can recommend specific properties from the live catalog by embedding `[[property:slug]]` markers that the frontend renders as inline cards.

**Setup (free tier):**
1. Get a free API key at https://aistudio.google.com/apikey
2. Add to `backend/.env`:
   ```
   GEMINI_API_KEY=AIza...
   GEMINI_MODEL=gemini-2.5-flash      # default — generous free tier
   ```
3. Restart the backend. The launcher button (gold sparkle, bottom-right / bottom-left in RTL) appears on every public page.

**Free-tier limits** (as of Google AI Studio launch pricing):
- `gemini-2.5-flash` — 10 RPM, 250K TPM, **250 requests per day**
- `gemini-2.5-flash-lite` — 15 RPM, 250K TPM, **1,000 requests per day** (lighter, even cheaper to upgrade)

For a typical real-estate site this comfortably handles ~50-100 conversations per day on the free tier. When you outgrow it, the same model on paid tier costs roughly **$0.075 per 1M input tokens / $0.30 per 1M output tokens** — a Claude Opus 4.7 conversation costs 10-20× more.

**How it works:**
- Backend `POST /api/v1/chat` builds a system instruction with the entire published property catalog and streams from Gemini
- Catalog is in-process cached for 2 minutes to avoid re-querying Mongo on every chat turn
- Per-IP rate limit: 20 messages per 5 minutes (in addition to the global API limit)
- If `GEMINI_API_KEY` is not set, the endpoint returns 503 cleanly — the rest of the API stays operational
- Visitor's locale (`en`/`ar`) is passed through so Gemini responds in the right language

---

## Seed demo data

The frontend ships with a mock dataset of 12 properties, 6 blog posts and 3 testimonials. Once the backend is running you can load the same dataset into Mongo so the public site renders from the real API:

```bash
cd backend
npm run seed         # idempotent — upserts by slug, keeps everything else
npm run seed:fresh   # wipes properties / blog / testimonials first
```

The public site falls back to mock data automatically if the API is unreachable, so dev stays green even before seeding.

---

## Bootstrap an admin user (one-liner)

```bash
# from backend/
node -e "
require('dotenv/config');
const m = require('mongoose');
const bcrypt = require('bcryptjs');
(async () => {
  await m.connect(process.env.MONGODB_URI);
  const Users = m.connection.collection('users');
  await Users.insertOne({
    name: 'Admin',
    email: 'admin@example.com',
    password: await bcrypt.hash('change-me-now', 12),
    role: 'admin', active: true, createdAt: new Date(), updatedAt: new Date(),
  });
  console.log('Admin created'); process.exit(0);
})();"
```

---

## What's in this pass

✅ Monorepo scaffold (frontend + backend) with `.env.example` files
✅ Next.js 15 App Router with full i18n (EN + AR/RTL) via next-intl
✅ Luxury Tailwind theme (onyx + champagne gold + ivory) with custom keyframes
✅ Header with mobile drawer + locale switcher + active-link indicator
✅ Footer with services, social, RERA line
✅ Floating WhatsApp + Call CTAs (locale-aware side)
✅ Cinematic homepage:
   - Hero with video background + word-by-word reveal
   - Glass property search bar
   - Featured properties carousel (Embla + autoplay)
   - 18-service grid with hover lifts
   - Animated stat counters
   - Luxury villa showcase with parallax
   - Investor opportunities band (fixed-bg)
   - Why Us 4-up grid
   - Testimonial carousel
   - Blog preview
   - Animated FAQ (with FAQPage JSON-LD)
   - Newsletter capture (wired to backend)
✅ SEO: dynamic metadata, hreflang, JSON-LD, sitemap.ts, robots.ts
✅ Express + Mongo backend with security stack (helmet, rate-limit, mongo-sanitize, xss, hpp)
✅ Schemas: Property, Blog, User, Inquiry, Testimonial, Settings, Service
✅ JWT auth + RBAC (admin / editor / broker / user)
✅ Cloudinary upload route (multer + transformations)
✅ Inquiry endpoint with email notification
✅ Newsletter, settings, testimonials endpoints

---

## Next-pass roadmap

These are intentionally **not** in this first pass — flag what to prioritize:

1. **Property listing + detail pages** (`/properties`, `/properties/[slug]`)
   - Filter UI, map view, comparison tray
   - Gallery lightbox, video player, virtual tour iframe, brochure download
   - Mortgage / EMI / ROI calculators
   - Schedule visit form + share buttons
2. **Services**, **Projects**, **About**, **Contact**, **Blog index + detail** pages
3. **Admin panel** (Next.js `/admin` sub-app or standalone): dashboard analytics, CRUDs for everything, media library, drag-to-reorder sections
4. **AI chatbot** (RAG over property data)
5. **Property comparison, saved properties, recently viewed** (zustand + localStorage)
6. **Currency converter**, push notifications, advanced search with map clustering
7. **Real Cloudinary video reels** for the hero (replace the placeholder Coverr URL)
8. **Real client logos / awards strip**, team grid, video testimonials section
9. **Live chat** integration (Intercom / Crisp)
10. **CI**: GitHub Actions for lint, type-check, build verify, Vercel preview comments

---

## Performance notes

- All home sections are client components only where needed (animations); the page shell is RSC
- `next/image` with `priority` only on the hero LCP image
- Embla carousel is tree-shakeable and small (~5KB gz)
- Framer Motion is dynamically imported by Next where used
- `optimizePackageImports` is enabled for `lucide-react` and `framer-motion`
- Backend ships gzip via `compression`, rate-limited per IP, indexed by `category`, `status`, `price`, `featured`
- A text index supports `?q=` search

---

## License

Proprietary — all rights reserved.
