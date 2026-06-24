# JanaGana setup guide

Two audiences:

- **Part A** — Non-technical client (daily use)
- **Part B** — Connect JanaGana to a website (you or your web person)
- **Part C** — Your 20-minute onboarding call script (selling JanaGana)

---

## Part A — For non-technical users (classes & contacts)

*Give this section to a client. No coding required.*

### What JanaGana does for you

- Lists your classes and events on a simple web page
- Lets people register online
- Keeps names and emails in one place (your CRM)
- Sends people back to your main website after they sign up

### Before your first class (one-time, ~30 minutes)

1. **Log in** to JanaGana with the email and password you were given.
2. **Check your business name** looks correct on the portal.
3. **Open “Events”** (or “Classes”) in the menu.
4. **Create one event:**
   - Title — e.g. “Retirement Planning Basics”
   - Date and time — pick a real date
   - Location — “Zoom” or your address
   - Short description — 2–3 sentences about who it’s for
   - Price — $0 for free classes
   - **Publish** the event (must be published, not draft)
5. **Click your own event** and use **Register** as a test — use your personal email.
6. **Check your email** for confirmation. If it arrived, you’re done.

### Every new class (repeat, ~10 minutes)

1. Events → **Add event**
2. Fill title, date, Zoom link or address, description
3. **Publish**
4. Copy the **registration link** and share it (email, social, your website)

### After people register (weekly, ~10 minutes)

1. Log in → **Registrations** or **Contacts**
2. See who signed up
3. Send a short reminder email 1 day before class (from JanaGana or your email)
4. After class, mark notes if someone wants a follow-up call

### Words to use with your audience

> “Sign up on our class page — you’ll get a confirmation email with the Zoom link.”

Do **not** say “CRM” or “tenant” to attendees.

### If something goes wrong

| Problem | What to try |
|---------|-------------|
| **“No operator access yet” / “not connected to a pilot community”** | See [Operator access (Clerk org mapping)](#operator-access-clerk-org-mapping) below |
| Nobody sees my class | Event must be **Published** and date in the **future** |
| No confirmation email | Check spam; ask your JanaGana admin to verify email settings |
| Wrong link on website | Ask whoever manages the website to check “tenant slug” (Part B) |

---

## Operator access (Clerk org mapping)

*You see this after signing in at janagana.namasteneedham.com — not on the public class portal.*

### What the message means

JanaGana has two layers:

| Layer | What it does |
|-------|----------------|
| **Clerk sign-in** | Proves who you are (`sanjeev@namasteneedham.com`) |
| **Tenant row in JanaGana DB** | Connects your **Clerk organization** to a community (`namaste-boston`, `purple-wings`, …) |

**Production pilot** only has two mapped communities today: **Namaste Boston** and **The Purple Wings**.

If you sign in with a Clerk org that is **not** mapped (e.g. **Safora Financial Planning**), you get:

> “Your account is not connected to a pilot community … Clerk organization must be mapped in JanaGana before the dashboard opens.”

That is **not** a broken password — your org simply is not linked in the database yet.

### What Safora’s website uses today

The Safora site embeds events for tenant slug **`namaste-boston`**. Public class registration uses that portal:

`https://janagana.namasteneedham.com/portal/namaste-boston/events`

So for **Safora class sign-ups**, you usually manage events as **Namaste Boston** in JanaGana admin — not under an unmapped “Safora Financial Planning” org.

### Fix option A — Use Namaste Boston (fastest for Safora classes)

1. Open **Clerk** (production dashboard for JanaGana).
2. Open the **Namaste Boston** organization (not Safora Financial Planning).
3. **Invite or add** `sanjeev@namasteneedham.com` as Admin (if not already a member).
4. Sign out of JanaGana → sign in again.
5. If Clerk asks which organization, choose **Namaste Boston**.
6. Dashboard should open; create/publish events there — they appear on Safora `/classes` when env slug is `namaste-boston`.

### Fix option B — Map “Safora Financial Planning” as its own tenant (later / product demo)

Only if you want a **separate** portal slug (e.g. `safora-financial`) for selling JanaGana to other clients:

1. In the **janagana** repo (admin/ops): run tenant bootstrap with your Clerk org ID  
   `org_3FVq…Tx6g` → new slug + `Tenant.clerkOrgId` row (see JanaGana `docs/12-PILOT-RESET.md`, `npm run pilot:bootstrap`).
2. Update Safora `.env`: `NEXT_PUBLIC_JANAGANA_TENANT_SLUG=your-new-slug`.
3. Self-serve “connect my existing org” in the UI is **disabled in pilot** on purpose — mapping is an admin step.

### Fix option C — Visitor only (no dashboard)

Attendees **do not** need operator access. They use the public portal links above to register. Operator mapping is only for **you** managing events and contacts.

### Who to contact

If you are the JanaGana admin: run preflight + bootstrap in the `janagana` project, or add yourself to the **Namaste Boston** Clerk org. If you are onboarding a client: use **Part C** and ensure their Clerk org is mapped before the onboarding call ends.


## Part B — Connect JanaGana to a website (Safora or client site)

*For you or a technical helper. ~30 minutes.*

### What the website needs

The site does **not** store registrations. It only:

1. **Shows** upcoming events (embedded list)
2. **Links** to JanaGana for registration

### Checklist — JanaGana side

- [ ] Tenant exists (e.g. `namaste-boston` or client’s slug)
- [ ] At least **one published event** with a future date
- [ ] Registration enabled on that event
- [ ] Portal URL works in browser:  
      `https://janagana.namasteneedham.com/portal/YOUR-TENANT-SLUG/events`

### Checklist — website side (Safora example)

Add to `.env.local` (local) and hosting env (e.g. Vercel):

```env
NEXT_PUBLIC_JANAGANA_PORTAL_BASE_URL=https://janagana.namasteneedham.com
NEXT_PUBLIC_JANAGANA_API_URL=https://janagana.namasteneedham.com
NEXT_PUBLIC_JANAGANA_TENANT_SLUG=your-tenant-slug
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Replace `your-tenant-slug` with the real tenant slug from JanaGana.

Restart dev server: `./start.sh`

### Verify (5 minutes)

1. Open `https://your-domain.com/classes` — events should appear (or a friendly empty state with link to portal)
2. Click **Register** on an event — should open JanaGana portal
3. Complete a test registration — should return to your site with a thank-you style URL (`?registration=registered` on Safora)
4. Confirm registration appears in JanaGana admin

### API note (for developers)

Events load from:

`GET {JANAGANA_API}/api/embed/events?tenantSlug={slug}&maxItems=12`

No API key in the browser for this embed — tenant slug must match a live tenant with public events.

---

## Part C — Your 20-minute onboarding call script (sell JanaGana)

*Use on Zoom with a non-tech business owner (advisor, coach, realtor, nonprofit).*

### Opening (2 min)

> “Today we’ll get you to one outcome: someone can find your next class online and register without calling you. Everything else can wait.”

### Screen share — their portal (8 min)

1. Log them in (or have them share screen after you create their account).
2. Walk through **one event** using Part A steps 4–6.
3. Have **them** type the title and description (you guide).
4. They click **Publish**.
5. They register with their own email — celebrate when confirmation arrives.

### Screen share — their website (5 min) *(if they have a site)*

> “Your website will show a list of classes. When someone clicks Register, they come here — JanaGana handles the form and email. You don’t need to paste names into Excel.”

Use Part B checklist — only set env vars if you manage their site; otherwise email the checklist to their web person.

### Close (5 min)

**Say:**

> “Weekly, you only need ten minutes: check who registered, send a reminder the day before, add a note if someone wants a follow-up. I’ll send you a one-page guide you can print.”

**Send after call:**

- This document — Part A only (PDF or link)
- Their portal login URL
- Their public events link

**Optional upsell (soft):**

> “If you want a planning calculator on your site like Safora, that’s a separate project — but classes and CRM work stand-alone today.”

---

## Safora-specific quick connect

Your demo tenant today defaults to `namaste-boston`. To go live:

1. Ensure events exist under that tenant in JanaGana admin
2. Set env vars in Vercel production (same four `NEXT_PUBLIC_*` keys)
3. Set `NEXT_PUBLIC_SITE_URL` to your real domain (not localhost)
4. Test `/classes` on production after deploy

You do **not** need Supabase for class sign-ups to work.
