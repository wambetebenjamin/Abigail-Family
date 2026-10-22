# Abigail Family

Co-parenting and family coordination for separated parents in Kenya.
**Raising children together, apart.**

Abigail Family gives two parents one shared space for the practical parts of raising a child: a shared calendar, a clear record of shared expenses, handover logs, secure messaging, a document vault and a private progress journal. The product is built so the child stays at the centre and neither parent is given a tool to score points against the other.

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16.4.2 (App Router), React 19.2.0 |
| Styling | Tailwind CSS 4.1.10 with the template's design tokens |
| Auth | NextAuth 5 (credentials and Google OAuth), JWT sessions |
| Data | Vercel KV when configured, in-memory store otherwise |
| Files | Vercel Blob when configured, guarded fallback when not |
| Validation | Zod on every API route |
| Abuse protection | reCAPTCHA v3 server verification, visible fallback below 0.5 |
| Motion | Lenis smooth scroll, Framer Motion, GSAP ScrollTrigger |
| Email | Nodemailer (invitations, welcome mail, enquiries) |

## Run locally

```bash
npm install          # or npm ci
cp .env.example .env.local
npm run dev          # http://localhost:3000
```

Node 24 is the target (`engines` and `.nvmrc`). The build also passes on Node 22, which is what the review sandbox runs.

### Demo account

Sign in at `/login` with:

```
demo@abigailfamily.co.ke
calmfamily
```

The login form has a "Use the demo account to look around" button that fills these in. The demo family (Amina and Brian) is seeded with two weeks of events, four shared expenses, two handovers, a three message thread, three vault documents and two private journal entries.

New accounts start empty, with honest empty states and a prompt to invite the co-parent.

## Environment variables

Copy `.env.example` to `.env.local`. Every variable is optional for a local preview: the app degrades gracefully and says so, rather than failing silently.

| Variable | Purpose | Behaviour when unset |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata | Falls back to `https://abigailfamily.co.ke` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number | Falls back to `254112272061` |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key | Forms submit without a token |
| `RECAPTCHA_SECRET_KEY` | Server only reCAPTCHA secret | Verification skipped, response reports `configured: false` |
| `NEXTAUTH_SECRET` | Session signing secret | A development fallback secret is used, set a real one in production |
| `NEXTAUTH_URL` | Auth base URL | Inferred from the request (`trustHost` enabled) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth | Google button hidden, credentials sign-in still works |
| `PEXELS_API_KEY` | Pexels API (optional tooling) | Not required, photos are hotlinked |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | Vercel KV | In-memory store, data resets on server restart |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob uploads | Upload forms explain that storage is not configured |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | Nodemailer | Emails are logged to the server console, enquiries still succeed |

## Routes

Marketing: `/`, `/features`, `/pricing`, `/about`, `/legal/privacy-policy`, `/legal/terms`, `/legal/cookie-policy`, `/500`, plus the branded `404` and `500` error boundaries.

Auth: `/login`, `/register`.

Dashboard (protected by NextAuth, redirects to `/login?callbackUrl=` when signed out): `/dashboard`, `/dashboard/calendar`, `/dashboard/expenses`, `/dashboard/handovers`, `/dashboard/messages`, `/dashboard/documents`, `/dashboard/journal`.

API:

| Route | Method | Notes |
| --- | --- | --- |
| `/api/auth/[...nextauth]` | GET, POST | NextAuth handlers |
| `/api/auth/register` | POST | Creates parent and family, sends welcome and invitation email |
| `/api/captcha/verify` | POST | Login preflight so a low score can show the visible fallback |
| `/api/calendar/add-event` | POST | Shared calendar event |
| `/api/expenses/add` | POST | Shared expense with split percentage |
| `/api/handovers/add` | POST | Handover log with optional photo URL |
| `/api/messages/send` | POST | Two-party message |
| `/api/documents/upload` | POST | Multipart upload to Vercel Blob, also used for receipts and handover photos |
| `/api/journal/add` | POST | Private journal entry, private to the author |
| `/api/send-enquiry` | POST | Contact form on `/about` |

Every write route verifies reCAPTCHA first, then validates with Zod. A score below 0.5 returns `403` with `requiresV2: true`, and the client renders a visible verification panel with a retry path and a WhatsApp escape hatch.

## Design system, inherited from the upload

The uploaded archive is a static Colorlib "Welfare" bootstrap template. The brief required building on that structure without redesigning it, so the tokens are inherited rather than invented:

- **Type**: Dosis for headings (`--font-display`), Overpass 300 for body at 16px with 1.8 line height (`--font-sans`). Same families and weights as `css/style.css`.
- **Warm accent**: `#f86f2d` primary, `#fa8f3d` secondary, `#faaa3a` tertiary, `#7cbd1e` leaf, taken from the template's SCSS variables.
- **Calm accents**: `#78d5ef` sky and `#f8f9fa` surface, taken from the template's compiled Bootstrap token block.
- **Dark section**: `#252525` footer and CTA band, matching `.ftco-footer`.
- **Brand mark**: two converging parent circles around a child circle, using the same two accent colours.

All CSS custom properties and the four icon `@font-face` rules (Flaticon, icomoon, Ionicons, open-iconic) are reproduced in `app/globals.css`. Font binaries live in `public/fonts/`, matching the template paths. The Bootstrap `:root` block is kept verbatim as a reference token set; the working palette lives in the Tailwind `@theme` block.

The original template is preserved under `design/template/welfare-gh-pages/` (190 files, names intact). Full tree: `docs/ZIP-STRUCTURE.md`.

## Motion inventory

1. Lenis smooth scroll (`components/site/SmoothScroll.tsx`, exact brief config).
2. WhatsApp button entrance pulse (`wa-pulse`).
3. Hero headline fade-slide up on mount (Framer Motion variants).
4. Feature card staggered fade-in on scroll.
5. How-it-works connector draws left to right (GSAP ScrollTrigger, `scaleX`).
6. Dashboard sidebar slides in from the left on route change, keyed by pathname.
7. Expense balance bar animates width on dashboard load.
8. Calendar event cards pop in when a date is selected, keyed by date.
9. Testimonial cards slide in from alternating sides.
10. Message send button micro-bounce on click.

All of it is disabled under `prefers-reduced-motion: reduce`, including the loading screen, which falls back to a plain percentage.

## Responsive notes

Authored mobile-first with the brief's breakpoints (sm 640, md 768, lg 1024, xl 1280, 2xl 1536).

- Dashboard sidebar is `hidden lg:flex lg:w-64`; the mobile bottom bar is `lg:hidden`, fixed, 64px tall, with `pb-safe`.
- The bottom bar shows five tabs (Overview, Calendar, Expenses, Messages, More). Handovers, Documents, Journal and support live in the More sheet, because the brief caps visible tabs at five.
- The expense table sits in `overflow-x-auto -mx-4 sm:mx-0` with a `min-w-[600px]` inner div and the mobile hint "Scroll left to see full table".
- The calendar grid scrolls horizontally under 520px; weekday labels collapse to `M T W T F S S` on mobile and `Mon` style labels from `sm`.
- Floating WhatsApp and voice tour buttons use `bottom-20 lg:bottom-6` on dashboard routes and `bottom-safe` / `bottom-safe-dash` safe area helpers.
- Inputs are `text-base` (16px) to prevent iOS zoom, and interactive targets are at least 44x44px.

## Build verification

```bash
npm ci
npx tsc --noEmit
npx next build
npm audit --audit-level=high
```

## Deliberate deviations from the build brief

1. **`next-auth` 5.0.0-beta.32 instead of 5.0.0-beta.28.** beta.28 declares a peer range of Next 14 and 15, so `npm ci` fails against Next 16. beta.32 is the first release that supports Next 16.
2. **`@vercel/blob` 2.8.2 instead of 0.29.4.** 0.29.4 was never published to npm (the 0.x line ends at 0.27.3), and 0.27.3 pulls a vulnerable `undici` and `@fastify/busboy` chain. 2.8.2 is the current stable release and clears `npm audit`.
3. **`nodemailer` 10.1.7 instead of 6.10.1.** The v6 line carries one critical, three high and two moderate advisories in 2026, which fails the zero high severity gate in Step 19.
4. **`jspdf` 4.2.1 instead of 3.0.1.** The v3 line carries a critical advisory. jsPDF is an unused dependency in this build, so the major bump has no runtime impact.
5. **`@tailwindcss/postcss` added.** Tailwind v4 cannot run through PostCSS without it.
6. **`legacy-peer-deps=true` in `.npmrc`.** NextAuth's optional nodemailer peer expects v7 or v8 while we install the patched v10, and beta.32's peer range still names Next 14 to 16. NextAuth's email provider is not used, so the mismatch is cosmetic.
7. **`motion-dom` and `motion-utils` pinned via `overrides`.** Framer Motion 12.18.0 breaks when npm hoists a newer motion-dom that renamed its exports.
8. **`/api/captcha/verify` added.** Login has no API route in the brief, but it needs reCAPTCHA verification before credentials sign-in so a low score shows the visible fallback instead of a generic auth error.
9. **Images hotlinked from the Pexels CDN.** The sandbox could not download from `images.pexels.com`. Details and a localisation path are in `image-credits.md`.
10. **`/500` responds with HTTP 500**, which is how Next treats a route named `500`. The page itself is fully branded and includes the WhatsApp number.
11. **Six dashboard destinations, five mobile tabs.** The brief caps the bottom bar at five tabs while listing six destinations, so Handovers, Documents and Journal live in the More sheet on mobile and appear directly in the desktop sidebar.
12. **`next lint` is kept in `package.json` but is not wired to a build gate.** Next 16 removed the built-in `next lint` command. TypeScript, the production build and `npm audit` are the enforced gates.

## Production hardening before real families use this

- Set a strong `NEXTAUTH_SECRET`, both reCAPTCHA keys and a dedicated reCAPTCHA v2 key pair for the visible fallback.
- Move documents to `access: 'private'` blobs (supported by @vercel/blob 2.x) with signed, authenticated downloads. The current unguessable public links are documented honestly in the privacy policy but are not the right long term posture for custody records.
- Replace the in-memory fallback with a real database and per-family row level access checks.
- Add audit logging for document access and account deletion, and a documented ODPC incident process.
