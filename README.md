# Safora — Financial Planning Platform

Educational financial planning website with class registration (JanaGana CRM), portfolio balance tools, and life insurance recommendation calculator.

## Features

- **Classes & events** — Upcoming workshops with Zoom/in-person registration via JanaGana portal
- **Portfolio Balance Planner** — Educational tool for Roth, 401(k), brokerage, insurance, and real estate allocation (includes optional Advisor Explanation Mode)
- **Life Insurance Recommendation** — DIME-based coverage analysis (educational / advisory use)
- **Compliance-first** — Regulatory disclaimers for insurance and financial advisory content

## Quick start

From the **project root**:

```bash
chmod +x start.sh   # first time only
./start.sh
```

Equivalent: `pnpm start:dev` (calls the same `start.sh`).

The dev server runs at **http://localhost:3001**.

### Manual setup

```bash
pnpm install
cp .env.example .env.local   # DATABASE_URL, NEXTAUTH_SECRET, JanaGana URLs
pnpm dev                     # same as ./start.sh
```

Use **pnpm** (lockfile: `pnpm-lock.yaml`).

### Startup script notes

| Do | Don't |
|----|--------|
| Run `./start.sh` from the repo root | Symlink `start.sh` → `scripts/start-dev.sh` (breaks path detection) |
| Use `pnpm start:dev` | Edit `scripts/start-dev.sh` to call itself (causes infinite loop) |

`start.sh` walks up to `package.json`, installs dependencies if `node_modules` is missing, then runs `pnpm dev`.

### Dev server messages (safe to ignore)

| Message | Meaning |
|---------|---------|
| `baseline-browser-mapping` … over two months old | Harmless dev-tool metadata warning |
| `middleware` file convention is deprecated … use `proxy` | Next.js 16 naming notice; app still runs |
| `Ready` on port **3001** | Success |

## JanaGana CRM integration

Class registration and lead capture use the [JanaGana](https://janagana.namasteneedham.com) visitor portal:

```env
NEXT_PUBLIC_JANAGANA_PORTAL_BASE_URL=https://janagana.namasteneedham.com
NEXT_PUBLIC_JANAGANA_API_URL=https://janagana.namasteneedham.com
NEXT_PUBLIC_JANAGANA_TENANT_SLUG=namaste-boston
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

Events are embedded via `GET /api/embed/events?tenantSlug=...`. Registration links open the JanaGana portal.

## Testing

```bash
pnpm run type-check
pnpm run test:unit
DATABASE_URL=postgresql://ci:ci@localhost:5432/ci pnpm build
DATABASE_URL=postgresql://ci:ci@localhost:5432/ci pnpm test
```

CI sets `DATABASE_URL` automatically; locally use `.env.local` or export it for production builds.

## Key URLs (local)

| Path | Purpose |
|------|---------|
| `/` | Homepage (classes-first) |
| `/classes` | Class registration |
| `/tools/balance` | Portfolio Balance Planner |
| `/life-insurance` | Life insurance tool |
| `/licenses` | Regulatory disclosures |

## Compliance

All tools are educational only. See `/licenses` for full regulatory disclosures.

## Data persistence (portfolio tool)

The balance planner **does not require a database**. Drafts auto-save in the browser; users can **Export** or **Import** JSON files. Sign-in sync across devices is a future phase (small Postgres table when Supabase is restored). Details: [docs/DATA_PERSISTENCE.md](docs/DATA_PERSISTENCE.md).

## Roadmap & JanaGana guides

| Doc | Who it's for |
|-----|----------------|
| [docs/NEXT_STEPS.md](docs/NEXT_STEPS.md) | Your prioritized task list (start here) |
| [docs/JANAGANA_SETUP_GUIDE.md](docs/JANAGANA_SETUP_GUIDE.md) | Connect Safora + non-tech client script for selling JanaGana |

| Need | Solution now | Later (optional) |
|------|----------------|------------------|
| Analyze portfolio | Browser + JSON file | — |
| Classes / CRM | JanaGana portal | — |
| Sign-in, admin, compare quotes | Requires `DATABASE_URL` | New Supabase when needed |

