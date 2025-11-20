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

### 2. AI Policy Scanner (`/scan`)
- Upload existing insurance policy documents
- AI-powered analysis using GPT-4 Vision
- Identifies coverage gaps and savings opportunities
- Personalized recommendations
- Market benchmark comparison

### 3. Transparent Pricing
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

## 🎯 Roadmap

See `IMPLEMENTATION_PLAN.md` for detailed roadmap.

### Phase 1: MVP (Current)
- ✅ Database schema with marketplace models
- ✅ AI Policy Scanner UI and API
- ✅ Multi-carrier comparison page
- ✅ 15 carriers seeded
- 🚧 Homepage cleanup
- 🚧 File upload integration

### Phase 2: Business Integration
- Real estate partner integration
- Mortgage broker partnerships
- Referral tracking system
- Analytics dashboard

### Phase 3: Carrier APIs
- Progressive API integration
- Lemonade API integration
- Additional carrier partnerships
- Real-time quote generation

### Phase 4: Advanced Features
- Bundle optimizer
- $20 advisory service
- Agent assignment system
- Payment processing

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
