# Platform Reference

This document is a concise reference to rebuild the platform from scratch. It covers architecture, key services, deployment, development workflow, and data schema pointers.

## Overview
- Framework: Next.js (app directory)
- Language: TypeScript
- Package manager: pnpm (lockfile: `pnpm-lock.yaml`)
- Database: Prisma (schema at `prisma/schema.prisma`)
- Testing: Playwright (end-to-end in `tests/`)

## Repo layout
- `src/app` — Next.js app routes and pages
- `src/components` — UI components
- `src/lib` — shared utilities
- `prisma/` — Prisma schema, seed, migrations
- `public/` — static assets
- `tests/` — e2e test specs and configs

## Development
1. Install dependencies: `pnpm install`
2. Start dev server: `pnpm dev` (Next.js)
3. Database: run `pnpm prisma migrate dev` then `pnpm prisma db seed` if applicable

## Build & Deployment
- CI: Vercel. Ensure `pnpm-lock.yaml` is committed and in sync with `package.json`.
- If Vercel fails with frozen-lockfile errors, run locally: `pnpm install` to regenerate lockfile, commit `pnpm-lock.yaml`.

## Testing
- E2E tests use Playwright located in `tests/`.
- Run locally: `pnpm test:e2e` (check package.json scripts)

## Prisma / Database
- Schema: `prisma/schema.prisma`
- Seed: `prisma/seed.ts`
- Migrations stored in `prisma/migrations/`

## Observability
- Sentry configs: `sentry.client.config.ts`, `sentry.server.config.ts`

## Common troubleshooting
- Build fails on Vercel due to lockfile mismatch — regenerate lockfile and commit.
- Missing environment variables — ensure Vercel project has required secrets (DATABASE_URL, NEXT_PUBLIC_*, etc.).

## Useful commands
- Install: `pnpm install`
- Dev: `pnpm dev`
- Build: `pnpm build`
- Start: `pnpm start`
- Format: `pnpm lint` / `pnpm format`

## References
- See `prisma/schema.prisma` for data model specifics.
- See `tests/` for test coverage and examples.
