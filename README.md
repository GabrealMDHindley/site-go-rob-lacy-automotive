# Go Rob Lacy — Website

The website for **Go Rob Lacy Inc.** ("People | Systems | Greater Results") — growth
systems for car dealerships and car salesmen.

Built with **Next.js** (App Router) + TypeScript + Tailwind CSS, with a 3D hero
(React Three Fiber), scroll animation (GSAP + Framer Motion), and an animated logo
loading screen.

---

## Launch it on your own Vercel account

You need a free [Vercel](https://vercel.com) account. Pick **one** of the two options.

### Option A — GitHub + Vercel (recommended: every future edit auto-deploys)

1. Create a new, empty repository on [GitHub](https://github.com/new) (any name,
   e.g. `go-rob-lacy-website`).
2. Upload the contents of this folder to it — either drag the files into GitHub's
   **"uploading an existing file"** page, or from a terminal inside this folder:
   ```bash
   git init
   git add -A
   git commit -m "Go Rob Lacy website"
   git branch -M main
   git remote add origin https://github.com/<your-account>/<your-repo>.git
   git push -u origin main
   ```
3. In Vercel: **Add New… → Project → Import Git Repository** → pick the repo →
   leave every setting at its default (Vercel detects Next.js) → **Deploy**.

From then on, every change pushed to `main` redeploys the site automatically.

### Option B — Vercel CLI (quickest, no GitHub)

With [Node.js](https://nodejs.org) 20+ installed, from a terminal inside this folder:

```bash
npm install -g vercel
vercel          # first run: log in, accept the defaults → preview deployment
vercel --prod   # publish to production
```

### Your domain

In the Vercel project: **Settings → Domains → Add** your domain and follow the DNS
instructions. The site picks up its production domain automatically for search
engines, the sitemap and social previews — no code change needed. (To force a specific
address, set `NEXT_PUBLIC_SITE_URL` — see `.env.example`.)

---

## Booking calendar → GoHighLevel

Every "Book Your Call" button goes to `/book`, the site's own day/time calendar
(Central Time, set in `src/lib/booking.ts`).

- **Before GoHighLevel is connected (works out of the box):** visitors see weekday
  slots, 9 AM–5 PM CT, and "Request This Time" opens a pre-filled email to the address
  in `src/data/site.ts` with their chosen time and details — no lead is lost.
- **Connect GoHighLevel** (bookings then land directly on your GHL calendar, with live
  availability and double-booking protection):
  1. In GoHighLevel, create (or choose) the calendar these calls should go on — set
     its hours and meeting length there.
  2. **Settings → Private Integrations → Create** one with these scopes:
     Contacts (read + write), Calendars (read + write), Calendar Events
     (read + write), and `locations/customFields.readonly`. Copy the token.
  3. In Vercel: **Project → Settings → Environment Variables**, add
     - `GHL_API_KEY` — the Private Integration token
     - `GHL_LOCATION_ID` — your sub-account (location) ID
     - `GHL_CALENDAR_ID` — the calendar's ID

     then **redeploy** (Deployments → ⋯ → Redeploy).
  4. Optional — add two contact custom fields in GHL and the booking fills them in:
     **Which Best Describes You?** (radio: "I own or manage a car dealership" /
     "I'm a car salesman") and **What Would You Like Help With?** (large text).

  Booked contacts are tagged `website-booking` and `dealership-site`; the dealership
  name goes into the contact's Company Name. After a booking, visitors land on a
  confirmation page.

---

## Editing the site

| What | Where |
| --- | --- |
| All text — services, steps, testimonials, stats, headlines, phone, email, address | `src/data/site.ts` |
| Colors | `src/app/globals.css` (the `@theme` block at the top) |
| Logos | `public/brand/` — `logo.svg` (full color, for light backgrounds), `logo-stacked.svg` (for dark backgrounds), `logo-lockup.svg` (horizontal, used in the header/footer) |
| Loading-screen video | `public/videos/brand/logo-reveal.mp4` + `poster.jpg` |
| Booking hours / timezone (before GHL is connected) | `src/lib/booking.ts` |
| Home page section order | `src/app/page.tsx` |

Optional video slots in `src/data/site.ts`: set a Vimeo ID on `vsl` to add a "See It In
Action" video section to the home page, or on `confirmationVideo` to show a video on
the post-booking confirmation page. Left empty, those sections simply don't appear.

## Run it locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build — run before deploying changes
npm run lint
```

Environment variables for local development go in `.env.local` (see `.env.example`).
