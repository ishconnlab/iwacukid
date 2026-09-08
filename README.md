# IWACU KIDS Platform

Digital ticketing, event management and gate scanning platform for **IWACU KIDS** — the Rwandan cultural performance group based in Nyakaliro, Rwamagana District.

Live app: **https://iwacukid.onrender.com**

---

## Overview

IWACU KIDS sells tickets for its traditional dance, modern dance, summer festival and vacation program events. This platform provides an end-to-end ticketing loop:

- Public marketing site (landing, events, programs, gallery, about, location/map)
- Online checkout with MTN MoMo, Airtel Money and manual USSD payments
- Digital QR tickets (emailed/PDF-generatable) embed the attendee identity
- Staff gate-scanning app with administrator clearance workflows
- Admin dashboard with live sales, revenue, occupancy and check-in analytics
- Bilingual UX: **English** and **Kinyarwanda**
- Installable **Progressive Web App (PWA)** with offline banner and custom icons
- WhatsApp support, social follow promo tiles (YouTube, TikTok, Instagram, Spotify)

## Tech Stack

| Layer      | Technology                                                        |
| ---------- | ----------------------------------------------------------------- |
| Frontend   | React 19, React Router, Tailwind CSS v4, Vite 6, lucide-react     |
| Maps       | Leaflet & react-leaflet                                           |
| Backend    | Node.js, Express                                                   |
| Database   | MongoDB Atlas (Mongoose)                                          |
| Auth       | JWT (HMAC-SHA256) + sha512 password hashing                       |
| Payments   | MTN MoMo Collections API (sandbox/live), Airtel Money, Manual USSD |
| QR/PDF     | qrcode, html5-qrcode, jsPDF                                       |
| Deploy     | Render (full-stack), Vercel (static frontend option)              |

## Getting Started

### Prerequisites

- Node.js **20+**
- MongoDB Atlas cluster (or any MongoDB), or a local `mongod`

### Install & run locally

```bash
npm install

# 1) Configure environment
cp .env.example .env
#    Set at minimum MONGODB_URI (+ MONGODB_MIRROR_URI if your network
#    blocks `mongodb+srv://` SRV lookups)

# 2) Start the dev server (Express API + Vite HMR on port 8080)
npm run dev
```

Open http://localhost:8080 — the server auto-seeds the database with starter
events, programs, gallery items and an admin user when collections are empty.

## Scripts

| Script          | Description                                                          |
| --------------- | -------------------------------------------------------------------- |
| `npm run dev`   | Run Express + Vite dev server with HMR                                |
| `npm run lint`  | Type-check the whole project via `tsc --noEmit`                       |
| `npm run build` | Build frontend (`vite build`) and bundle backend (`esbuild` → `dist/server.cjs`) |
| `npm start`     | Run the production server (`node dist/server.cjs`)                    |
| `npm run preview` | Preview the static build via Vite                                  |

## Environment Variables

Create a `.env` from `.env.example`. Full reference:

| Variable                    | Required | Purpose                                            |
| --------------------------- | -------- | -------------------------------------------------- |
| `MONGODB_URI`               | yes      | MongoDB Atlas connection string (`+srv`)            |
| `MONGODB_MIRROR_URI`        | no       | Explicit replica-set URI fallback when SRV DNS fails |
| `JWT_SECRET`                | no       | Auth token signing secret                            |
| `MTN_MOMO_API_URL`          | yes*     | MTN MoMo Collections base URL (sandbox by default)   |
| `MTN_MOMO_API_KEY`          | yes*     | MTN primary API key                                  |
| `MTN_MOMO_API_SECRET`/`MTN_MOMO_SECRET` | yes* | MTN API secret                               |
| `MTN_MOMO_SUBSCRIPTION_KEY` | yes*     | MTN subscription/Ocp key                             |
| `MTN_MOMO_ENVIRONMENT`      | no       | `sandbox` (default) or `live`                        |
| `AIRTEL_API_URL`            | no       | Airtel Money API base                               |
| `AIRTEL_CLIENT_ID` / `AIRTEL_CLIENT_SECRET` | no | Airtel credentials                          |
| `STORAGE_*`                 | no       | Cloudflare R2 / S3-compatible object storage         |
| `APP_URL` / `FRONTEND_URL` / `API_URL` | no | Product URLs (defaults to Render domain)   |

`*` required for live MTN MoMo; the platform ships with a sandbox/demo payment mode so checkout works without credentials.

## Core Domain & Flows

The backend guarantees institutional integrity — every document in every
collection carries a readable string `id` (Mongo `_id` is disabled).

**Order → Ticket lifecycle**

1. `POST /api/orders` atomically holds capacity (`soldQuantity` increment with
   an availability guard) and issues one QR ticket per attendee.
2. Payment is initiated via `POST /api/payments/initiate`; the gateway result
   lands in `POST /api/payments/webhook/mtn` (and `/airtel`).
3. `db.recordPayment` is **idempotent per `transactionRef`**:
   - `SUCCESS` settles the order, activates tickets and re-holds capacity if a
     prior failure had released it.
   - `FAILED` reverts capacity exactly once and cancels tickets; it never
     un-settles a paid order.
   - Recommendation codes (`IWACU10` …) accrue `usageCount` per paid order.
4. Abandoned `PENDING` orders are automatically **expired after 30 minutes**,
   releasing their capacity (runs at boot and every 10 min).

**Check-in**

- `POST /api/check-in/verify` / `POST /api/check-in` resolve a ticket by QR
  payload, code or id, enforce `VALID`/`USED`/`CANCELLED` state, and write an
  immutable check-in record with sequential per-event numbering.
- Scanner clearance is role-based (`SUPER_ADMIN`, `ADMIN`, `STAFF` with
  `isApprovedToScan`) plus a gate master-key.

## API Surface (summary)

| Area         | Endpoints                                                          |
| ------------ | ------------------------------------------------------------------ |
| Public       | `/settings`, `/categories`, `/events`, `/programs`, `/gallery`, `/orders/:id`, `/tickets/lookup`, `/health` |
| Payments     | `/payments/gateway-status`, `/payments/initiate`, `/payments/confirm-demo`, `/payments/webhook/mtn`, `/payments/webhook/airtel`, `/payments/manual-ussd-submit` |
| Check-in     | `/check-in/verify`, `/check-in`, `/check-in/verify-clearance`       |
| Auth         | `/auth/register`, `/auth/login`, `/auth/me`, `/auth/update-credentials` |
| Admin (JWT)  | `/dashboard/overview`, `/admin/orders`, `/admin/tickets`, `/admin/payments`, `/admin/check-ins`, `/admin/events*`, `/admin/customers`, `/admin/scanners*`, `/admin/settings`, `/admin/ussd*` |

## Deployment

### Render (recommended — full stack)

1. Add the repo as a Render **Web Service** (Node).
2. Build command: `npm install && npm run build`
3. Start command: `npm start`
4. Add the environment variables from `.env.example` (at least `MONGODB_URI`).
5. Render builds and serves `dist/` plus the API at `/api` on the same origin.

### Vercel (frontend-only option)

The repo includes `vercel.json` (Vite build, SPA rewrites). When hosted this
way the frontend calls the Render API cross-origin thanks to CORS
configuration in `server.ts`.

## GitHub Workflows

- `.github/workflows/ci.yml` — runs on every push/PR to `main`: installs deps,
  type-checks and builds frontend + backend bundle.
- `.github/workflows/deploy.yml` — on push to `main`, triggers a Render
  redeploy via the `RENDER_DEPLOY_HOOK_URL` repository secret. The job
  **skips gracefully** when the secret is not configured.

## Project Structure

```
├── server/            Express API, MongoDB models & domain logic
│   ├── api.ts         All HTTP routes
│   ├── db.ts          Institutional domain flows (orders/payments/check-in)
│   ├── mongo.ts       Mongoose models (`_id:false` + string `id` PKs)
│   ├── seed.ts        Seed content (events, programs, gallery, users)
│   ├── auth.ts        JWT helpers
│   └── payments/      MTN MoMo provider
├── src/               React frontend
│   ├── api/client.ts  Typed API client (same-origin or cross-origin)
│   ├── components/    Layout, events, home, common, social, admin, pwa
│   ├── context/       Language, Auth, TicketWallet
│   ├── locales/       en / rw translations
│   ├── pages/         Public + admin pages
│   ├── lib/site.ts    Central site config (brand, contacts, socials)
│   └── types.ts       Shared domain types
├── public/            PWA icons, favicon, manifest
├── server.ts          Express bootstrapping (CORS, static, lifecycle)
└── vite.config.ts
```

## License

Private project — © IWACU KIDS. All rights reserved.