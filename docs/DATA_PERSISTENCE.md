# Data persistence strategy

## What needs a database today?

| Feature | Database required? | Current approach |
|---------|-------------------|------------------|
| Portfolio Balance Planner | **No** | `localStorage` + JSON export/import |
| Life insurance tool (inputs) | **No** | `localStorage` |
| Class registration | **No** (on Safora) | JanaGana portal + embed API |
| Email sign-in / sessions | **Yes** | Supabase Postgres + NextAuth + Resend |
| Admin dashboard, quote compare, policy scan | **Yes** | Prisma models |

Public planning tools are designed to work **without** login or a live database.

## Recommended path (phased)

### Phase 1 — Now (no Supabase)

- **Browser storage** — drafts auto-save in `localStorage` on `/tools/balance`.
- **Export / import JSON** — users keep a file on their device; advisors can email a file back and forth.
- **JanaGana** — keep for classes, CRM, and registration (already integrated).
- **Dev without DB** — optional `DATABASE_URL`; console shows an info note instead of errors.

### Phase 2 — When you want “login = restore my portfolio”

Add a **small** Supabase (or any Postgres) table — not the full legacy schema unless you need admin/compare again:

```text
portfolio_snapshots (user_id, data jsonb, updated_at)
```

Link `user_id` to NextAuth (Google or email). One row per user, overwrite on save.

### Phase 3 — Optional

- **JanaGana** — if their API later supports custom contact fields, mirror a snapshot id or link for CRM context (not a substitute for structured JSON).
- **UploadThing** — only if you want server-side file storage; for balance data, **client-side JSON import** is simpler and avoids storing PII on your servers.

## What we are not doing yet

- Reviving paused Supabase for portfolio-only use (overkill).
- Storing portfolio numbers in JanaGana without a documented API for arbitrary JSON.
- Requiring sign-in to use the balance tool.

## User-facing message

> Your entries stay in this browser. Export a JSON file to back up or move to another device. Sign-in sync across devices is planned when database auth is re-enabled.
