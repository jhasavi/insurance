# SELECT: Life Insurance Recommendation — Implementation & Rationale

## What I implemented
- A multi-step Life Insurance Recommendation Tool at route `/life-insurance`.
- A reusable component: `src/components/LifeInsuranceTool.tsx` with validation, `localStorage` persistence, reset, accessible result region, copy/download result, and basic analytics placeholder.
- A wrapper page at `src/app/life-insurance/page.tsx` and a header nav link at `src/components/header.tsx`.
- An E2E Playwright test at `tests/e2e-life-insurance.spec.ts` that exercises the user flow.

## High-level vision
Build a lightweight, production-ready recommendation helper that:
- Is easy and fast for users (mobile-first, multi-step, minimal fields).
- Produces defensible, explainable recommendations (clear rules + DIME calculation).
- Integrates with carrier mappings (Transamerica / WFG) for actionable product suggestions.

## Flow & decision logic

1. User enters inputs across three steps: Age, Income → Debt, Mortgage → Children, Primary Goal.
2. Validation ensures sensible values for Age and Income before allowing recommendation.
3. Coverage amount calculated using the DIME formula:

   Coverage = Debt + Mortgage + (Income × 10) + (Children × $100,000)

4. Product recommendation rules (simple, explainable):
- If Primary Goal = `Budget-Friendly` → recommend `Level Term` (term).
- Else if Age > 50 and Primary Goal = `Wealth Transfer` → recommend `Whole Life` (permanent).
- Otherwise → recommend `Level Term` (term).

5. Term length guidance (if Term recommended):
- Age ≤ 30 → 30 years
- Age ≤ 40 → 20 years
- Age ≤ 50 → 15 years
- Age > 50 → 10 years

## Flowchart (high level)
- Start → Collect inputs (Age, Income, Debt, Mortgage, Children, Goal)
- Validate required fields
- Compute DIME coverage
- Branch on Goal + Age:
  - `Budget-Friendly` → Level Term
  - `Wealth Transfer` & Age > 50 → Whole Life
  - else → Level Term
- If Term → suggest term length by age bucket
- Output recommendation card (type, coverage, term length)

## Carrier/product gathering (Transamerica & WFG)

I attempted to fetch the carrier product pages automatically to extract exact product names and brief feature lists. The automated fetch encountered extraction limits on the public Transamerica product pages (dynamic content / site protections prevented reliable scraping). For safety and accuracy I did not invent product names nor map to specific policy SKUs automatically.

Recommended next step for carrier mapping (requested):
- Please confirm the exact Transamerica product names you sell (e.g., Transamerica Level Term, Transamerica Whole Life, Indexed Universal Life names, or internal product codes used by WFG/your agency). If you provide those product names or carrier PDFs/links, I will map each recommendation case to specific Transamerica/WFG policies and include underwriting highlights (age limits, face amount ranges, simplified issue options).

Example mapping (generic, ready to be replaced with carrier-specific names):
- `Level Term` recommendation → map to Transamerica Term product(s) (10/15/20/30 year level term) or term products available via WFG distribution.
- `Whole Life` recommendation → map to Transamerica Whole Life / participating whole life products for wealth transfer needs.
- If you prefer Indexed Universal Life (IUL) or Universal Life for wealth transfer and tax-advantaged cash value, we can expand the rule set to recommend `IUL/UL` when client goals include accumulation or estate planning and age/health make permanent solutions cost-effective.

## Files added/changed
- `src/components/LifeInsuranceTool.tsx` — main tool (component)
- `src/app/life-insurance/page.tsx` — page wrapper
- `src/components/header.tsx` — nav link
- `tests/e2e-life-insurance.spec.ts` — Playwright E2E test
- `SELECT.md` — this document

## How I come to recommendations (explainability)
- Use explicit, auditable rules (goal + age) rather than opaque ML models.
- Coverage computed by DIME, a standard, well-known quick heuristic.
- Term lengths are age-based heuristics to match common replacement horizons.

## Next actions I can take (pick any)
1. Map recommendations to exact Transamerica/WFG products once you provide product names or confirm URLs (I will then update `SELECT.md` and the component to show product links/briefs).
2. Add server-side persistence (save recommendations to your DB) and simple agent dashboard to review leads.
3. Add analytics events and telemetry (Sentry + product analytics) to measure engagement.
4. Improve product logic (consider health, smoker status, occupation class) and add premium estimates.
5. Add unit tests for the recommendation logic and integrate into CI.

---
If you want, I can now map to exact Transamerica/WFG products — please paste the product names or carrier links you want used, or let me fetch again if you prefer I retry automated extraction (I can attempt more pages or use a manual selection mode).
