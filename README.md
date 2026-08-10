# TrafficIQ

**Customer Acquisition Intelligence for retail.** Know exactly where your new customers
come from — and where your next ones should. Configured for Torches NYC (Midtown Manhattan).

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Leaflet + OpenStreetMap.

## Develop

```bash
npm install
npm run dev      # http://localhost:3002
```

## Build

```bash
npm run build && npm run start
```

`npm run typecheck` runs `tsc --noEmit`.

## What's inside

- **Marketing site** (`/`) + brand guidelines (`/brand`)
- **Product app**: Overview, Acquisition (funnel), **Traffic Map** (live Leaflet/OpenStreetMap
  tiles, ZIP-anchored trade areas, real competitor locations), Campaigns + a multi-step
  Campaign Builder, Partners, Attribution, Customers, Opportunities, Reports, Integrations,
  Settings — plus a global ⌘K "Ask TrafficIQ" command bar.

All figures are derived in code from a single seeded dataset (`src/lib/demo.ts`), so the
numbers always reconcile. No database or API keys required to run.

## Deploy

Framework auto-detected as Next.js. On Vercel: import the repo and deploy (no env vars
needed). Or from this directory: `npx vercel --prod`.
