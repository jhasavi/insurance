# Namaste Insurance - Transparent Marketplace

A Next.js-based transparent insurance marketplace that allows users to compare real quotes from multiple carriers and analyze their existing policies with AI.

## 🎯 Vision

Build a **transparent insurance marketplace** - not a lead funnel, but a real insurance search engine that shows actual quotes, protects user privacy, and provides unbiased recommendations.

### Key Differentiators

- **Transparency First**: Show real quotes with disclosed commissions
- **Privacy-First**: No spam, compare anonymously
- **AI-Powered**: Policy scanner analyzes existing coverage
- **Unbiased**: Show all carriers, not just high-paying ones

## 🚀 Features

### 1. Multi-Carrier Quote Comparison (`/compare`)
- Side-by-side comparison of quotes from 15+ carriers
- Real pricing with transparent commission disclosure
- Filter and sort by price or rating
- Anonymous browsing - no spam guarantee

### 2. Life Insurance Growth Toolkit (`/life-insurance`)
- Guided Life Insurance recommendation builder for advisors and clients
- Personalized premium estimate, coverage calculator, and rider guidance
- Client-ready one-pager output for term, IUL, and whole life scenarios
- Lead pipeline tracking with stage updates and bulk actions
- Built-in engagement tools: WhatsApp/SMS script sharing and Calendly scheduling

### 3. Advisor Resources
- Localized MA/Boston market context and advisor knowledge base
- Follow-up script library for new leads, term clients, IUL prospects, and referrals
- Objection-handling templates and coverage gap messaging

### 4. AI Policy Scanner (`/scan`)
- Upload existing insurance policy documents
- AI-powered analysis using GPT-4 Vision
- Identifies coverage gaps and savings opportunities
- Personalized recommendations
- Market benchmark comparison

### 5. Transparent Pricing
- All referral fees disclosed upfront
- No hidden commissions
- User consent required for data sharing

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **AI**: OpenAI GPT-4o (Vision API)
- **UI**: TailwindCSS + shadcn/ui
- **Deployment**: Vercel

## 📦 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── compare/              # Quote comparison page
│   ├── scan/                 # AI policy scanner page
│   └── api/
│       └── ai/
│           └── policy-scanner/   # Policy analysis API
├── components/
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── ai/
│   │   └── policy-parser.ts  # OpenAI integration
│   ├── prisma.ts             # Database client
│   └── utils.ts              # Utilities
└── types/                    # TypeScript types
```

## 🗄️ Database Schema

### Core Models

- **InsuranceCarrier**: Carrier information (Progressive, GEICO, etc.)
- **ComparisonQuote**: Multi-carrier quotes with transparent pricing
- **PolicyAnalysis**: AI policy scanning results
- **Referral**: Ethical referral tracking
- **BundleRecommendation**: Cross-carrier optimization
- **AdvisorySession**: Premium advisory service

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database (Supabase)
- OpenAI API key

### Installation

1. **Clone and install dependencies**
   ```bash
   pnpm install
   ```

2. **Set up environment variables**
   
   Copy `.env` file and configure:
   ```env
   DATABASE_URL="postgresql://..."
   OPENAI_API_KEY="sk-..."
   NEXT_PUBLIC_SUPABASE_URL="https://..."
   NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
   ```

3. **Run database migrations**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Seed carrier data**
   ```bash
   npx tsx prisma/seed.ts
   ```

5. **Run development server**
   ```bash
   pnpm dev
   ```

6. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 📦 Key Pages & Features

| Route | Description |
|---|---|
| `/` | Life-first homepage with hero, scenarios, and conversion CTAs |
| `/life-insurance` | Main Life Insurance recommendation tool (4-step guided form) |
| `/life-insurance/learn` | Knowledge base: Term vs IUL vs Whole Life, underwriting, MA context |
| `/life-insurance/scripts` | Follow-up script library (WhatsApp, SMS, by scenario) |
| `/leads` | Leads dashboard — stage filters, search, bulk stage actions |
| `/recommendation/[id]` | View saved recommendation by ID |
| `/compare` | Multi-carrier quote comparison (Auto/Home, internal beta) |
| `/scan` | AI policy scanner |
| `/agent-one-pager` | Printable advisor one-pager |

## 🚩 Feature Flags

| Flag | Location | Default | Description |
|---|---|---|---|
| `SHOW_AUTO_HOME_TABS` | `src/app/compare/page.tsx:30` | `false` | Set to `true` to expose Auto/Home tab in the compare page UI |

## 🔑 Environment Variables

```env
DATABASE_URL="postgresql://..."          # PostgreSQL (Prisma)
NEXTAUTH_URL="https://your-domain.com"   # NextAuth callback URL
NEXTAUTH_SECRET="..."                    # Random secret for NextAuth
OPENAI_API_KEY="sk-..."                  # GPT-4o for policy scanner / AI features
NEXT_PUBLIC_CALENDLY_URL="https://calendly.com/namaste1"  # Booking link in Schedule CTA
SENTRY_DSN="..."                         # Optional: error tracking
NEXT_PUBLIC_GA_MEASUREMENT_ID="..."      # Optional: Google Analytics
```

## 🎯 Current Status

### Life Insurance Business Features (Active)
- ✅ Life-first homepage positioning
- ✅ 4-step Life Insurance recommendation tool with premium estimation
- ✅ Advisor knowledge assist (talking points, objections, compliance notes)
- ✅ Lead stage tracking (New / Follow-up / Closed) with localStorage persistence
- ✅ WhatsApp & SMS follow-up script sharing from recommendation output
- ✅ Schedule consultation CTA (Calendly: `calendly.com/namaste1`)
- ✅ Leads dashboard with stage filters, search, and bulk stage updates
- ✅ Knowledge base at `/life-insurance/learn` (Term, IUL, Whole Life, MA context)
- ✅ Script library at `/life-insurance/scripts` (7 scenarios, filterable)

### Auto/Home (Internal Beta)
- ✅ Quote comparison data for Auto and Home
- ✅ Hidden from public nav (flip `SHOW_AUTO_HOME_TABS=true` to enable)
- 🔜 Real carrier API integration

### Phase 2 Roadmap
- Real carrier API quotes (Progressive, Lemonade, etc.)
- Referral tracking with partner commission reporting
- Email drip campaign integration (new lead → follow-up sequences)
- Mobile-optimized lead capture form for field use

## 🔐 Privacy & Compliance

- **No Spam Guarantee**: Users control when they're contacted
- **Anonymous Browsing**: Compare quotes without providing contact info
- **Transparent Commissions**: All referral fees disclosed upfront
- **User Consent**: Explicit permission required for data sharing

### Required Licensing
- Massachusetts Insurance Producer License (pending)
- E&O Insurance
- Privacy Policy (GDPR/CCPA compliant)
- Terms of Service

## 💰 Business Model

### Revenue Streams

1. **Affiliate Commissions** (Primary): 10-15% of annual premium
2. **Advisory Service** (Secondary): $20 full policy review
3. **Partner Referrals** (Tertiary): Real estate/mortgage referrals
4. **SaaS for Brokers** (Future): White-label platform

### Year 1 Projection: $50K
- Affiliate commissions: $30K
- Advisory fees: $5K  
- Partner referrals: $15K

## 🤝 Contributing

This is a private project. Contact the owner for collaboration opportunities.

## 📄 License

Proprietary - All rights reserved

## 📞 Contact

- Location: Newton, MA
- Email: insurance@namastebostonhomes.com
- Phone: (617) 789-0100
- Website: [https://namasteinsurance.com](https://namasteinsurance.com)
## 📚 Educational & Support Pages

- `/learn` — Insurance education, guides, glossary, and FAQs
- `/glossary` — Common insurance terms explained
- `/faq` — Frequently asked questions
- `/contact` — Contact info and support
- Custom 404 page for unknown routes

All navigation links are tested for existence and content using Playwright E2E tests.

---

**Built with ❤️ to fix the broken insurance comparison space**
