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

## Recent Feature Additions (implementation notes)

- Inflation & Replacement Years: the DIME income replacement now supports a selectable replacement-years multiplier (5, 10, 15) and an annual inflation toggle (default 3%). The recommendation uses compound inflation over a 20-year horizon to keep benefit purchasing power aligned with long-term needs.

- Wealth Accumulation (IUL) branch: when `Primary Goal` = `Wealth Accumulation` and client age < 50, the tool recommends `Indexed Universal Life (IUL)` and surfaces features such as `Cash Value Growth` and `Tax-Free Loans` for agents to discuss with prospects.

- Suggested Strategy: if the client reports both a mortgage and young children, the tool recommends splitting the total coverage into two term policies (one sized to mortgage payoff, one sized to family/income replacement) to reduce current premium outlay while preserving coverage for critical needs.

- Gated Details: the tool shows the recommended product type and headline coverage for free; to view the full DIME breakdown and carrier-specific recommendations the user provides an email (unlock). This supplies a small lead capture flow and allows delivery of the one-pager by email.

- Underwriting Toggles: added `Tobacco Use` and a basic `Health Rating` (Standard, Preferred, Super Preferred) which update the `Underwriting Highlights` text in the results. These do not change the coverage math but provide agent-facing talking points.

- Carrier Mapping Placeholder: Transamerica product placeholders (e.g., `Trendsetter Super`, `Financial Foundation IUL`, `Trendsetter IUL`) were added as a static mapping file (`public/product-mapping.json`). The recommendation engine pulls product names from this mapping as placeholders until you provide exact product SKUs or URLs.

- Schedule CTA: a `Schedule Consultation` button packages the tool's JSON results into a `data` query parameter and opens a Calendly booking URL (replace with your booking link). This allows agents/prospects to schedule meetings pre-populated with the recommendation context.

---
If you want, I can now map to exact Transamerica/WFG products — please paste the product names or carrier links you want used, or let me fetch again if you prefer I retry automated extraction (I can attempt more pages or use a manual selection mode).

## Strategic Business Decisions (agent-level — no technical details)

These are recommended business-level choices to present to leadership for how the tool should operate, the products to offer, and the sales motions tied to each recommendation.

- Product Offering Scope: limit initial public recommendations to two clear paths: Affordable Term (10/15/20/30) and Permanent (Whole Life / UL/IUL) for estate/transfer goals. This keeps the tool simple and reduces compliance complexity while covering the majority of client needs.

- Carrier Prioritization: present Transamerica as the primary carrier (since you work with them) with WFG-distributed alternatives for clients who need different underwriting pathways. Display a clear "Why this carrier" note (pricing, underwriting strength, product fit) so agents can justify selection.

- Recommendation Transparency: always show the DIME calculation line-by-line and the decision logic (goal + age bucket). Agents and clients should see why the recommendation was made — this improves trust and reduces follow-up questions.

- Sales Playbook per Recommendation:
  - Budget-Friendly / Level Term: Position as short-to-medium income protection; emphasize affordability, term laddering, and conversion options (if available). Prioritize fast-issue products and simplified underwriting to close quickly.
  - Wealth Transfer / Whole Life: Position as long-term estate planning; highlight cash value, guaranteed death benefit, and tax-favored transfer. Recommend permanent products when legacy is the primary goal.
  - Income Replacement default path: present as Level Term with suggested term length tied to youngest dependent or mortgage payoff horizon.

- Cross-sell & Bundling: when a life recommendation is generated, surface relevant cross-sell opportunities (mortgage protection, disability income, critical illness) and a suggested script. Track conversions to measure lift.

- Compliance & Disclosures: include standard, state-specific disclaimers on the one-pager and in the email template (agent must verify state availability). Keep a short, plain-language disclosure that the tool provides suggestions and is not a carrier quote.

- Pricing & Premium Guidance: for the demo, use ballpark premium ranges only (low/typical/high) and clearly mark them as estimates. Do not display firm premiums unless integrated with carrier rate tables or broker APIs.

- Underwriting Pathway Strategy: prefer products that support simplified issue or accelerated underwriting for the Budget-Friendly segment to increase placement rates and speed to issue. For higher face amounts or wealth-transfer cases, route to full underwriting with advanced sales support.

- Lead Handling & Follow-up: when an agent clicks "Save to CRM" capture the scenario, recommended product, and a short agent note template. Trigger an automated follow-up task or email template to the prospect within 24 hours.

- Pilot Metrics (90-day pilot): measure adoption (# tools run), conversion-to-lead, lead-to-app, time-to-quote, and agent feedback score. Use these to justify expanding to premium estimates and automated carrier mapping.

- Go-To-Market Phases:
  1. Internal pilot with agents — gather qualitative feedback and fix UX.
  2. Soft launch to a subset of clients — measure conversions and issues.
  3. Full launch with carrier mappings, premium ranges, and CRM plumbing.

Update policy: any strategic change in product mapping, carrier prioritization, or sales plays will be reflected in this `SELECT.md` (business decisions only), not in technical docs.

## Navigation, Engagement & SEO — Strategic Decisions

- Menu placement: add `Life Insurance` under the primary navigation and a `Tools` submenu grouping (Compare, Scan, Life Insurance). This increases discoverability for agents and customers searching specifically for life insurance guidance.

- Homepage prioritization: include a clear CTA to the `Life Insurance Tool` in the hero area to drive adoption from high-intent visitors.

- Engagement metric: surface a lightweight `Engagement` badge in the header to encourage internal adoption tracking; use the badge score as a KPI in agent dashboards and sales huddles (do not expose algorithm details publicly).

- SEO & authorship: surface `Sanjeev Jha` and `Namaste Boston Homes` in site metadata and content where authorship/credibility matters (home hero, about page, and one-pager email footers). This supports brand/author search and local SEO in Boston.

- Sitemap & discovery: ensure `/life-insurance` is included in the sitemap and referenced from the footer and main nav; monitor indexing for `Sanjeev Jha` and `Namaste Boston Homes` related queries in Google Search Console.

- CTAs & funnels: route `Life Insurance` leads to a short booking flow or agent handoff (Calendly or in-house scheduler) with the recommendation context prefilled to reduce friction and increase conversion.

- Measurement: track `tools run`, `unlock email captures`, `schedule consults`, and `save-to-CRM` as primary KPIs for the life-insurance funnel. Use 90-day pilot to measure conversion lift and refine messaging.

- Content strategy: create a short `Life Insurance 101` guide targeted to Boston homeowners (mentioning Namaste Boston Homes contextually) to capture search intent and support SEO landing pages.

- UX priority: keep the Life tool entrypoint lightweight (3-step flow) and emphasize transparency (DIME breakdown) above the fold to increase trust and reduce churn.

- Rollout approach: start with agent-only beta, then public pilot; use agent feedback to tune messaging and product mappings before wider launch.

## Recent Business Decisions

- Add a Boston-focused landing section and author attribution to increase local SEO and trust for Boston homeowners (authored by Sanjeev Jha / Namaste Boston Homes).
- Track a lightweight engagement KPI for the Life tool (tools run / unlocks / schedules) to evaluate adoption during the 90-day pilot.
- Include the Life Insurance landing route in the sitemap and primary navigation to prioritize discoverability and funnel conversion.
