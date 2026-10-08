# Prinshi Trades — Phase 1 site (drops + waitlist)

Next.js (App Router), TypeScript, Tailwind. Deploys on Vercel.

## Run locally

```bash
cp .env.example .env.local   # set ADMIN_PASSWORD and APP_SECRET at minimum
npm install
npm run dev
```

Without Supabase env vars the site uses a local JSON file in `.data/` (gitignored), seeded from `content/drops.seed.json`. Without `RESEND_API_KEY` the confirmation email is printed to the server console, including the confirm and unsubscribe links.

## Production setup

1. **Database:** create a Supabase project, run `supabase/migrations/0001_init.sql`, set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
2. **Email:** set `RESEND_API_KEY` and `EMAIL_FROM` (a verified sender domain).
3. **Admin:** set `ADMIN_PASSWORD` and a long random `APP_SECRET`.
4. **Optional:** `GHL_WEBHOOK_URL` forwards every sign-up to GoHighLevel. `NEXT_PUBLIC_GA4_ID` enables GA4 after consent. `NEXT_PUBLIC_META_PIXEL_ID` only when paid ads run.
5. Set `NEXT_PUBLIC_SITE_URL` to the public URL (used in emails, sitemap and JSON-LD).

## Where things live

| What | Where |
|---|---|
| Brand config, origin line, contact details, hero media | `src/lib/site.ts` |
| Drops (create, edit, stock state, size chart, images) | `/admin` → New drop / edit |
| Sign-up counts per drop, by country, today | `/admin` |
| CSV export of sign-ups with consent timestamps | `/admin/export` |
| Design votes (up to 3 mockups, one vote per email, results after close) | `/admin/polls` → `/vote/<id>` |
| EN/FR label table | `src/lib/i18n.ts` |
| FAQ copy | `src/lib/faq.ts` |
| Legal templates (marked pending legal review) | `src/app/privacy`, `terms`, `cookies` |
| Product images | `public/images/` (referenced by path in the admin) |

## Owner inputs still needed

These are either `null` in `src/lib/site.ts` (hidden until filled) or still sample content:

- Contact email, WhatsApp number, Instagram handle
- Confirm the origin line wording
- Logo and the accent colour from the winning artwork (`--accent` in `src/app/globals.css`)
- Hero clip and poster image; the current poster is a placeholder
- Real drops: name, design, print type, colour, price (or leave blank), expected month, fabric and GSM, care, size chart, photos
- About page story, Shipping and Returns policy for India and Canada
- A lawyer's review of Privacy, Terms and the Cookie notice

Sample drops carry a visible "Sample listing" banner until replaced or unticked in the admin.

## Stock states

Exactly one per drop, set in the admin:

- **In stock:** sizes shown, Add to cart disabled with "Checkout opens with the drop".
- **Sold out:** Notify me form.
- **Coming soon:** Notify me form plus the expected month, when set.

No stock counts, countdowns or urgency copy anywhere.

## Consent and data

Each sign-up stores email, WhatsApp (optional), product, size, country, UTM source/medium/campaign, timestamp, both consent flags with timestamps, confirmation time and unsubscribe time. Email is double opt-in: nothing is sent until the confirm link is opened. Every email carries an unsubscribe link and `List-Unsubscribe` headers. Analytics scripts load only after "Accept all" in the cookie banner; "Reject all" has equal prominence.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```
