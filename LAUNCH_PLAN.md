# 4-Week MVP Launch Plan
**Goal:** Transform from prototype to functional insurance marketplace

## Week 1: Foundation (Auth + Infrastructure)
**Target:** Users can create accounts, consent tracking, analytics events

### Day 1-2: Authentication
- [ ] Install next-auth: `pnpm add next-auth@beta @auth/prisma-adapter`
- [ ] Configure email provider (Resend or Nodemailer)
- [ ] Create `/api/auth/[...nextauth]/route.ts`
- [ ] Add magic link email templates
- [ ] Build `/auth/signin` and `/auth/verify` pages
- [ ] Add session middleware to protected routes
- [ ] Test: User can sign up with email and log in

### Day 3: Consent & Audit
- [ ] Update User model with consent fields:
  ```prisma
  marketingConsent      Boolean @default(false)
  referralConsent       Boolean @default(false)
  dataProcessingConsent Boolean @default(false)
  consentTimestamp      DateTime?
  ```
- [ ] Run migration: `npx prisma migrate dev --name add_consent_fields`
- [ ] Create consent capture component
- [ ] Add audit logging helper: `logAuditEvent(userId, action, resource)`
- [ ] Test: Consent captured on signup and referral clicks

### Day 4: Analytics Events
- [ ] Define event schema:
  ```typescript
  - compare_started
  - compare_completed
  - policy_uploaded
  - policy_analyzed
  - quote_viewed
  - quote_sorted
  - referral_clicked
  - advisory_requested
  ```
- [ ] Create `/lib/analytics.ts` with event tracking
- [ ] Add server-side event tracking to GA4
- [ ] Add events to key user actions
- [ ] Test: Events flowing to GA4

### Day 5: Profile Completion
- [ ] Create `/onboarding` flow (3 steps):
  1. Basic info (name, phone, address)
  2. Insurance needs (auto, home, bundle)
  3. Current coverage (optional)
- [ ] Save to Profile model
- [ ] Gate features requiring profile completion
- [ ] Test: New user completes onboarding

**Week 1 Deliverable:** ✅ Users can sign up, log in, complete profile, consent is tracked

---

## Week 2: Guided Compare Flow
**Target:** Users get personalized quote recommendations (manually curated)

### Day 6-7: Multi-Step Quote Form
- [ ] Create `/compare/new` with 6-step wizard:
  - Step 1: Coverage type (auto, home, bundle)
  - Step 2: Personal info (age, marital status)
  - Step 3: Vehicle details (if auto)
  - Step 4: Property details (if home)
  - Step 5: Coverage preferences
  - Step 6: Review & submit
- [ ] Save to QuoteIntake model
- [ ] Add progress indicator
- [ ] Add smart defaults with tooltips
- [ ] Test: User completes quote request

### Day 8: Results Page
- [ ] Fetch ComparisonQuote records for user
- [ ] Display 4-6 carrier quotes
- [ ] Show coverage details, pros/cons
- [ ] Add commission transparency disclosure
- [ ] Add coverage gap warnings
- [ ] Add sorting (price, rating, coverage)
- [ ] Test: User sees curated quotes

### Day 9: Admin Quote Entry
- [ ] Create `/admin/quotes/new` page
- [ ] Form to input:
  - User ID or email
  - Carrier selection
  - Premium (annual/monthly)
  - Coverage details (JSON editor)
  - Deductibles
  - Discounts applied
  - Affiliate link
  - Commission amount
- [ ] Save to ComparisonQuote (isManual=true)
- [ ] Test: Admin creates quote, user sees it

### Day 10: Education Tooltips
- [ ] Create tooltip component with learn more links
- [ ] Add 20+ tooltips to quote flow:
  - "What is bodily injury liability?"
  - "How much coverage do I need?"
  - "Deductible vs premium tradeoff"
  - "Why bundling saves money"
- [ ] Link to `/learn/glossary#term`
- [ ] Test: User hovers, sees plain-English explanation

**Week 2 Deliverable:** ✅ Functional quote comparison with manual quotes

---

## Week 3: Policy Scanner (Real Implementation)
**Target:** Users upload policy → AI analysis → savings recommendations

### Day 11-12: Upload Pipeline
- [ ] Set up cloud storage (S3 or Supabase Storage)
- [ ] Create upload API: `/api/upload/policy`
- [ ] Implement file validation (PDF, PNG, JPG, max 10MB)
- [ ] Upload to storage, return URL
- [ ] Create PolicyAnalysis record with status='UPLOADING'
- [ ] Test: File uploads successfully

### Day 12-13: OCR + LLM Processing
- [ ] Set up OCR service (AWS Textract or Google Document AI)
- [ ] Create async job queue (or simple webhook)
- [ ] Extract text from document
- [ ] Pass to GPT-4 Vision via `analyzePolicyWithVision()`
- [ ] Parse response, validate with Zod
- [ ] Update PolicyAnalysis with extractedData and aiInsights
- [ ] Set status='COMPLETE' or 'FAILED'
- [ ] Test: Policy analyzed end-to-end

### Day 14: Confidence Scoring
- [ ] Add confidence calculation logic:
  ```typescript
  - Carrier name found: +30 points
  - Premium extracted: +20 points
  - Coverage limits found: +30 points
  - Policy number found: +10 points
  - Dates valid: +10 points
  ```
- [ ] Flag for human review if < 90%
- [ ] Create notification for agents
- [ ] Test: Low-confidence analysis flagged

### Day 15: Results Page
- [ ] Build `/scan/results/[id]` page
- [ ] Show current policy details
- [ ] Display gap analysis with explanations
- [ ] Show savings opportunity with proof
- [ ] Add "Get Better Quotes" CTA → /compare
- [ ] Add confidence badge
- [ ] Test: User sees actionable results

**Week 3 Deliverable:** ✅ Working policy scanner with real AI

---

## Week 4: Education + Agent Tools
**Target:** Self-service learning + basic CRM

### Day 16-17: /learn Section
- [ ] Create `/learn/glossary/page.tsx`
- [ ] Add 50 insurance terms:
  - Bodily injury liability
  - Property damage
  - Collision coverage
  - Comprehensive coverage
  - Deductible
  - Premium
  - Umbrella insurance
  - (43 more...)
- [ ] Create `/learn/basics/page.tsx`
- [ ] Write guides:
  - "How Car Insurance Works"
  - "Understanding Your Policy"
  - "What to Do After an Accident"
  - "How to File a Claim"
- [ ] Create `/learn/coverage-guide/page.tsx`
- [ ] Add coverage calculator prototype
- [ ] Test: Content renders, links work

### Day 18: Agent Inbox
- [ ] Create `/admin/leads/page.tsx`
- [ ] Display leads in queue (status=NEW)
- [ ] Add filters (status, source, date)
- [ ] Add assignment action
- [ ] Create `/admin/leads/[id]/page.tsx` detail view
- [ ] Show full profile, intake data, uploaded docs
- [ ] Add note-taking interface
- [ ] Test: Agent can manage leads

### Day 19: Consent Flows
- [ ] Add consent checkbox to quote form
- [ ] Create referral disclosure modal
- [ ] Track consent in AuditLog
- [ ] Update Referral model with consentTimestamp
- [ ] Add "Manage Preferences" to user settings
- [ ] Test: Consent captured, user can revoke

### Day 20: Polish + Testing
- [ ] End-to-end testing of full flows
- [ ] Mobile responsiveness check
- [ ] Accessibility audit (WCAG AA)
- [ ] Performance optimization (lazy loading, image optimization)
- [ ] SEO metadata for all pages
- [ ] Error handling and loading states
- [ ] Test: All flows work on mobile

**Week 4 Deliverable:** ✅ Complete MVP with education, agent tools, compliance

---

## Post-Launch (Week 5+)

### Immediate Priorities
1. **Carrier Integration Research** (1 week)
   - Contact BoldPenguin, Tarmika, Canopy Connect
   - Evaluate Clearcover/Lemonade direct APIs
   - Compare pricing, coverage, SLAs
   - Choose 1-2 to integrate first

2. **Advisory Session Flow** (1 week)
   - Implement Stripe payment ($20)
   - Build file attachment system
   - Create agent review interface
   - Add transcript/report generation

3. **Renewal Engine** (1 week)
   - Store effective/renewal dates in Policy
   - Create cron job for -45/-30 day reminders
   - Trigger re-quote flow automatically
   - Send email with savings opportunities

### Medium-Term (Months 2-3)
- Bundle optimizer using BundleRecommendation model
- Claims helper wizard
- VIN decoder integration
- Property data API (Attom/Estated)
- Agent scheduling (Calendly integration)

### Long-Term (Months 4-6)
- SOC 2 compliance
- Multi-state licensing
- Mobile app (React Native)
- Partner portal for real estate/mortgage brokers
- Advanced personalization

---

## Success Metrics

### Week 1-4 (MVP)
- [ ] 100 user signups
- [ ] 50 completed quote requests
- [ ] 25 policy scans
- [ ] 10 referral clicks
- [ ] <3s page load time
- [ ] 90%+ mobile usability score

### Month 2-3 (Growth)
- [ ] 500 user signups
- [ ] 200 quote completions
- [ ] 50 policy purchases (tracked referrals)
- [ ] $5,000+ affiliate revenue
- [ ] 60%+ quote completion rate
- [ ] 4.5+ star average rating

### Month 4-6 (Scale)
- [ ] 2,000 user signups
- [ ] 800 quote completions
- [ ] 200 policy purchases
- [ ] $20,000+ monthly revenue
- [ ] 3+ carrier API integrations
- [ ] 70%+ NPS score

---

## Technical Debt to Address

### Security (Critical)
- [ ] Implement field-level encryption for sensitive data
- [ ] Set up KMS for API key encryption
- [ ] Add rate limiting to all endpoints
- [ ] CSRF protection on forms
- [ ] Content Security Policy headers
- [ ] Regular dependency updates

### Observability (Important)
- [ ] Structured logging with request IDs
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] Uptime monitoring (BetterStack)
- [ ] Database query optimization

### Compliance (Critical)
- [ ] GLBA compliance checklist
- [ ] CCPA data subject request automation
- [ ] Privacy policy review by attorney
- [ ] Terms of service review
- [ ] Insurance license verification per state

---

## Resources Needed

### Services
- [ ] Email provider (Resend - $20/mo)
- [ ] Database (Supabase - $25/mo)
- [ ] Storage (S3 or Supabase - $10/mo)
- [ ] OCR service (AWS Textract - usage-based)
- [ ] OpenAI API (GPT-4 Vision - usage-based)
- [ ] Payment processing (Stripe - 2.9% + 30¢)
- [ ] Monitoring (Sentry - Free tier OK for now)

**Estimated monthly cost:** ~$100-200 + usage

### Team (Optional)
- Licensed insurance agent for compliance review (contract)
- Legal review for privacy/terms (one-time)
- Content writer for education materials (contract)

---

## Quick Wins This Week

Based on GPT's recommendation, start with these **5 tasks** immediately:

1. **Auth setup** - Get next-auth working (4 hours)
2. **Guided compare form v1** - Basic wizard using QuoteIntake (6 hours)
3. **Policy upload skeleton** - File upload → placeholder results (4 hours)
4. **Consent logging** - Track user consent on key actions (2 hours)
5. **Agent inbox** - Simple lead list view (4 hours)

**Total: ~20 hours of focused work = launch-ready foundation**

---

## Questions to Answer

1. **OCR Provider:** AWS Textract vs Google Document AI vs Azure Form Recognizer?
   - Recommendation: **Google Document AI** (best for insurance docs, $1.50/1k pages)

2. **Auth Provider:** NextAuth vs Supabase Auth vs Clerk?
   - Recommendation: **NextAuth** (free, flexible, you control data)

3. **Email Provider:** Resend vs SendGrid vs AWS SES?
   - Recommendation: **Resend** (best DX, React Email templates)

4. **Storage:** S3 vs Supabase Storage vs Cloudflare R2?
   - Recommendation: **Supabase Storage** (already using Supabase for DB)

5. **Payment:** Stripe vs PayPal vs Square?
   - Recommendation: **Stripe** (industry standard, best API)

6. **Carrier Integration:** Aggregator vs Direct APIs?
   - Recommendation: **Start with BoldPenguin** (fastest to integrate, widest coverage)

---

## Next Steps

**Right now:**
1. Review this plan with your team
2. Set up accounts for required services
3. Choose between my recommendations or propose alternatives
4. Start with Week 1, Day 1 tasks

**Want me to help?**
I can immediately start implementing:
- Auth system
- Quote form wizard
- Policy upload pipeline
- Education content
- Agent inbox

Just tell me which to prioritize!
