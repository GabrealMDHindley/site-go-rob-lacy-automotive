# Go Rob Lacy — site-go-rob-lacy-automotive

The car-dealership site for **Go Rob Lacy Inc.** ("People | Systems | Greater
Results") — the seven growth systems Go Rob Lacy installs for car dealerships and car
salesmen: Website + CRM + SMS & Email Automations, Video Walkthroughs Of Vehicles, Paid
Commercials & Lead Generation, AI Chat Agents, AI Voice Agents, Content Creation &
Growth, and Viral Content Automation.

Built and deployed by the Universal Business Studio pipeline
(`clients/go-rob-lacy-automotive/` in the studio repo carries the intake, sourcing,
brand notes, and changelog). Layout and motion system cloned from the studio's
Train & Scale site, rebranded navy/gold from the client's logo and rewritten for
dealerships. This is the dealership-only build; the client's broader
multi-industry site is a separate project.

## Stack

- **Next.js App Router** + TypeScript + Tailwind CSS v4
- **React Three Fiber / drei** — the ascending-summit wireframe hero scene
- **GSAP ScrollTrigger** — the scroll-scrubbed "How It Works" rail (7 systems)
- **Framer Motion** — section reveals throughout
- An OpenArt-generated logo-reveal video powers the loading screen
  (`public/videos/brand/logo-reveal.mp4`), with a code-only summit draw-in as the
  fallback when it's absent — see `src/components/Preloader.tsx`

## Content

All copy lives in `src/data/site.ts`, with its sourcing documented at the top of the
file. Services, the 10-step buyer system, and the 20 testimonials are verbatim from
the studio owner's Summit Holdings AI car-dealership page.

## Development

```bash
npm install
npm run dev
```

```bash
npm run build   # production build — must pass before every push
npm run lint    # eslint
```

## Booking calendar (built in, GoHighLevel-ready)

Every "Book Your Call" CTA routes to `/book` — the site's own day/time calendar
(`src/components/BookingForm.tsx`), ported from the studio's Train & Scale site where
the GoHighLevel flow was verified end-to-end. Times are Central (`America/Chicago`).

- **Before GoHighLevel is connected (request mode):** `/api/book/availability` serves
  weekday business-hours slots (9 AM–5 PM CT, hourly, next 10 weekdays). Visitors pick a
  time and "Request This Time" opens a pre-filled email to the client with the slot and
  their details — nothing is lost.
- **Connected (live mode):** set three Vercel env vars and redeploy — no code change:
  - `GHL_API_KEY` — a GHL Private Integration token with Contacts (read + write),
    Calendars (read + write), Calendar Events (read + write), and
    `locations/customFields.readonly` scopes
  - `GHL_LOCATION_ID` — the sub-account (location) ID
  - `GHL_CALENDAR_ID` — the calendar bookings should land on

  Availability then comes live from that calendar (`src/lib/ghl.ts`), `/api/book`
  re-checks the slot, upserts the contact (tagged `website-booking`,
  `dealership-site`; dealership name → Company Name) and books the appointment, then
  redirects to the gated `/confirmation` page.
- Optional GHL contact custom fields the booking fills if they exist (matched by name):
  `Which Best Describes You?` (radio: "I own or manage a car dealership" / "I'm a car
  salesman") and `What Would You Like Help With?` (large text).

## Deploys

Auto-deploys on every push to `main` via the connected GitHub repository (Vercel team
**SHAI**).
