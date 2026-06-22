# Safora — Financial Planning Platform

Educational financial planning website with class registration (JanaGana CRM), portfolio balance tools, and life insurance recommendation calculator.

## Features

- **Classes & events** — Upcoming workshops with Zoom/in-person registration via JanaGana portal
- **Portfolio Balance Planner** — Educational tool for Roth, 401(k), brokerage, insurance, and real estate allocation
- **Life Insurance Recommendation** — DIME-based coverage analysis (existing tool)
- **Compliance-first** — Regulatory disclaimers for insurance and financial advisory content

## Quick start

**Recommended** — from the project root:

```bash
chmod +x start.sh    # first time only
./start.sh
```

Do **not** symlink `start.sh` to `scripts/start-dev.sh` — that breaks path detection. Use the committed `start.sh` in the repo root.

Or: `pnpm start:dev`

Manual steps:

```bash
pnpm install
cp .env.example .env.local   # configure DATABASE_URL, NEXTAUTH_SECRET, JanaGana URLs
pnpm dev                     # http://localhost:3001
```

Use `pnpm` if possible (this repo's lockfile is `pnpm-lock.yaml`). `npm run dev` also works if dependencies are already installed.

### Dev server messages (safe to ignore)

| Message | Meaning |
|---------|---------|
| `baseline-browser-mapping` … over two months old | Harmless dev-tool metadata warning; does not affect your site |
| `middleware` file convention is deprecated … use `proxy` | Next.js 16 naming change; your app still runs normally |
| `Ready in Xs` on port **3001** | Success — open http://localhost:3001 |

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
pnpm build
pnpm test
```

## Compliance

All tools are educational only. See `/licenses` for full regulatory disclosures.
