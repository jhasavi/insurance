# 🚀 Quick Start Guide

## Get Running in 5 Minutes

### Step 1: Configure Environment (2 mins)

```bash
# Copy example env
cp .env.example .env

# Generate NextAuth secret
openssl rand -base64 32

# Edit .env and add:
# NEXTAUTH_SECRET="[paste secret from above]"
# NEXTAUTH_URL="http://localhost:3001"
# RESEND_API_KEY="re_[get from resend.com]"
# EMAIL_FROM="Safora <noreply@safora.namastebostonhomes.com>"
```

### Step 2: Install Dependencies (1 min)

```bash
pnpm install
```

### Step 3: Database (30 secs)

```bash
# Already done! Migration was created:
# prisma/migrations/20251120183436_add_nextauth_and_consent/
```

### Step 4: Start Server (30 secs)

```bash
./start.sh
# or: pnpm start:dev
```

Open **http://localhost:3001** (not 3000).

### Step 5: Test! (1 min)

1. Go to http://localhost:3001
2. Click "Sign In"
3. Enter your email
4. Check inbox for magic link
5. Click link → You're signed in!

---

## What's Working Right Now

✅ **Authentication**
- Sign in with email magic links
- User session management
- Sign out
- Protected routes

✅ **Homepage**
- Header with navigation
- User menu (when signed in)
- Hero section
- All existing content

✅ **Quote Form (Partial)**
- Step 1: Coverage type selection
- Step 2: Personal info
- Steps 3-6: Coming soon!

---

## File Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── signin/page.tsx          ← Sign-in page
│   │   ├── verify-request/page.tsx  ← Email sent page
│   │   └── error/page.tsx           ← Error page
│   ├── compare/
│   │   └── new/page.tsx             ← Quote form (partial)
│   ├── api/
│   │   └── auth/[...nextauth]/      ← NextAuth API
│   └── page.tsx                     ← Homepage (updated)
├── components/
│   ├── auth-provider.tsx            ← Session wrapper
│   ├── header.tsx                   ← Site header
│   ├── user-nav.tsx                 ← User menu
│   └── ui/                          ← UI components
├── lib/
│   ├── auth.ts                      ← NextAuth config
│   ├── audit.ts                     ← Audit logging
│   └── analytics.ts                 ← Event tracking
```

---

## Common Commands

```bash
# Development
pnpm dev                 # Start dev server
pnpm build               # Build for production
pnpm start               # Start production server

# Database
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create migration
npx prisma generate      # Regenerate client

# Testing
pnpm playwright test     # Run tests (if configured)
```

---

## Troubleshooting

**"Email not sending"**
→ Check RESEND_API_KEY in .env
→ Restart dev server after .env changes

**"Session error"**
→ Clear browser cookies
→ Check DATABASE_URL is correct

**"Configuration error"**
→ Make sure NEXTAUTH_SECRET is set
→ Use openssl command to generate it

---

## Next Steps

1. Configure .env (see Step 1 above)
2. Test authentication works
3. Continue building quote form
4. Build quote intake API
5. Launch MVP!

**Time to functional MVP:** ~8 hours remaining

---

Ready? Let's go! 🚀
