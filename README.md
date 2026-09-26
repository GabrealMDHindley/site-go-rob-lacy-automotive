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

## Integrations

- Every "Book Your Call" CTA routes to `/book`, which embeds the client's own live
  GoHighLevel booking calendar (the same calendar as goroblacy.com's "Book a call") —
  booking is not rebuilt on this site, and no API keys are needed.

## Deploys

Auto-deploys on every push to `main` via the connected GitHub repository (Vercel team
**SHAI**).
