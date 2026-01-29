# Platform Reference — Consolidated

This master document consolidates platform-level documentation into a single reference. It gathers architecture, deployment, developer workflow, and observability notes.

## Contents
- Architecture & repo layout (from `PLATFORM_REFERENCE.md`)
- Analytics & tracking (from `GOOGLE_ANALYTICS_SETUP.md`)
- Authentication notes (pointer to `AUTH_SETUP_COMPLETE.md`)

## Architecture & Key Commands
See the original `PLATFORM_REFERENCE.md` for a full technical reference. Key points:
- Framework: Next.js (app dir), TypeScript
- Package manager: pnpm (commit `pnpm-lock.yaml`)
- Database: Prisma (schema at `prisma/schema.prisma`)

Useful commands:
- Install: `pnpm install`
- Dev: `pnpm dev`
- Build: `pnpm build`
- Start: `pnpm start`
- Tests: `pnpm test` (Playwright)

## Analytics
Tracking ID: `G-PXQ6PGV4P9`
Implementation: `src/app/layout.tsx` uses Next.js `Script` to load GA4 and send events.

See `GOOGLE_ANALYTICS_SETUP.md` for event plans, verification steps, and privacy notes.

## Authentication
Auth is implemented with NextAuth (Prisma adapter) and magic links. See `AUTH_SETUP_COMPLETE.md` for setup, env vars, testing, and production checklist.

---

Files referenced (kept for historical detail):
- [PLATFORM_REFERENCE.md](../PLATFORM_REFERENCE.md)
- [GOOGLE_ANALYTICS_SETUP.md](../GOOGLE_ANALYTICS_SETUP.md)
- [AUTH_SETUP_COMPLETE.md](../AUTH_SETUP_COMPLETE.md)

