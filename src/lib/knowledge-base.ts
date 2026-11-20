// Research / knowledge-base content: public-data reference library for
// client conversations (Roth vs. permanent insurance, term+invest vs.
// permanent, annuity trends, tax planning, college planning).
//
// This is the single source of truth for both the public /research page
// and prisma/seed-knowledge.ts (which loads the same data into Supabase
// once the Prisma models in prisma/schema.prisma are migrated there).
//
// Every data point below is a historical, publicly reported figure with
// a named source and an "as of" date. None of it is a projection, and
// none of it should be read as a guarantee of future results — say so
// out loud when using this with a client.

export type KnowledgeCategory =
  | "ROTH_VS_PERM"
  | "TERM_PLUS_INVEST_VS_PERM"
  | "ANNUITY_TRENDS"
  | "TAX_SAVINGS"
  | "COLLEGE_PLANNING"

export type DataSource = {
  id: string
  name: string
  publisher: string
  url: string
  retrievedAt: string // ISO date this was pulled
}

export type MarketDataPoint = {
  id: string
  assetClass:
    | "SP500"
    | "WHOLE_LIFE_DIVIDEND"
    | "IUL_CREDITING"
    | "FIA_SALES"
    | "ANNUITY_SALES_TOTAL"
    | "CONTRIBUTION_LIMIT"
  label: string
  carrier?: string
  periodYears?: number
  startYear?: number
  endYear?: number
  value: number
  unit: string
  asOfDate: string
  sourceId: string
  notes?: string
}

export type KnowledgeTopic = {
  id: string
  slug: string
  category: KnowledgeCategory
  title: string
  summary: string
  body: string[] // paragraphs
  dataPointIds?: string[]
  sourceIds: string[]
}

export const dataSources: DataSource[] = [
  {
    id: "fidelity-sp500",
    name: "What is the average S&P 500 return?",
    publisher: "Fidelity Learning Center",
    url: "https://www.fidelity.com/learning-center/trading-investing/sp-500-average-return",
    retrievedAt: "2026-11-20",
  },
  {
    id: "northwestern-mutual-dir",
    name: "How we determine dividends",
    publisher: "Northwestern Mutual",
    url: "https://northwesternmutual.com/how-we-determine-dividends",
    retrievedAt: "2026-11-20",
  },
  {
    id: "massmutual-2026-dividend",
    name: "MassMutual to Pay Record $2.9 Billion in Policyowner Dividends in 2026",
    publisher: "MassMutual",
    url: "https://www.massmutual.com/about-us/news-and-press-releases/press-releases/2025/10/massmutual-announces-2026-policyowner-dividend-payout",
    retrievedAt: "2026-11-20",
  },
  {
    id: "guardian-dividend",
    name: "Announcing a record-breaking dividend",
    publisher: "Guardian Life",
    url: "https://guardianlife.com/about-guardian/annual-dividend",
    retrievedAt: "2026-11-20",
  },
  {
    id: "insurance-geek-dir-history",
    name: "Whole Life Dividend Rate History",
    publisher: "InsuranceGeek",
    url: "https://www.insurancegeek.com/life-insurance/rates/whole-life-dividend-history/",
    retrievedAt: "2026-11-20",
  },
  {
    id: "mutual-of-omaha-iul",
    name: "Income Advantage historical index account performance",
    publisher: "Mutual of Omaha",
    url: "https://cdn.mutualofomaha.com/mutualofomaha/documents/pdfs/discover-iul/ia-historical-rate.pdf",
    retrievedAt: "2026-11-20",
  },
  {
    id: "wealthmanagement-iul-critique",
    name: "Indexed Universal Life: Back-Testing and Cap Rates and Averages, Oh My",
    publisher: "WealthManagement.com",
    url: "https://www.wealthmanagement.com/insurance/indexed-universal-life-back-testing-and-cap-rates-and-averages-oh-my-",
    retrievedAt: "2026-11-20",
  },
  {
    id: "limra-2025-annuity-sales",
    name: "LIMRA: Final U.S. Retail Annuity Sales Set New Sales High, Totaling $464.1 Billion in 2025",
    publisher: "LIMRA",
    url: "https://www.limra.com/en/newsroom/news-releases/2026/limra-final-u.s.-retail-annuity-sales-set-new-sales-high-totaling-$464.1-billion-in-2025/",
    retrievedAt: "2026-11-20",
  },
  {
    id: "irs-2026-limits",
    name: "401(k) limit increases to $24,500 for 2026, IRA limit increases to $7,500",
    publisher: "IRS",
    url: "https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500",
    retrievedAt: "2026-11-20",
  },
  {
    id: "savingforcollege-fafsa-assets",
    name: "How 6 Different Assets Can Affect Your FAFSA and Financial Aid Eligibility",
    publisher: "SavingForCollege.com",
    url: "https://www.savingforcollege.com/article/how-7-different-assets-can-affect-your-financial-aid-eligibility",
    retrievedAt: "2026-11-20",
  },
  {
    id: "collegeinvestor-life-insurance-fafsa",
    name: "Life Insurance And FAFSA Rules",
    publisher: "The College Investor",
    url: "https://thecollegeinvestor.com/65892/life-insurance-and-fafsa-rules/",
    retrievedAt: "2026-11-20",
  },
]

export const marketDataPoints: MarketDataPoint[] = [
  // --- S&P 500 trailing annualized returns (Fidelity, avg. of monthly returns, through Dec 2025) ---
  { id: "sp500-5y", assetClass: "SP500", label: "S&P 500 trailing 5-year return", periodYears: 5, startYear: 2021, endYear: 2025, value: 14.4, unit: "% annualized", asOfDate: "2025-12-31", sourceId: "fidelity-sp500", notes: "Average of monthly returns, not a strict CAGR. Includes dividends." },
  { id: "sp500-10y", assetClass: "SP500", label: "S&P 500 trailing 10-year return", periodYears: 10, startYear: 2016, endYear: 2025, value: 14.8, unit: "% annualized", asOfDate: "2025-12-31", sourceId: "fidelity-sp500", notes: "Average of monthly returns, not a strict CAGR. Includes dividends." },
  { id: "sp500-20y", assetClass: "SP500", label: "S&P 500 trailing 20-year return", periodYears: 20, startYear: 2006, endYear: 2025, value: 11.0, unit: "% annualized", asOfDate: "2025-12-31", sourceId: "fidelity-sp500", notes: "Window includes the 2008 financial crisis." },
  { id: "sp500-30y", assetClass: "SP500", label: "S&P 500 trailing 30-year return", periodYears: 30, startYear: 1996, endYear: 2025, value: 10.4, unit: "% annualized", asOfDate: "2025-12-31", sourceId: "fidelity-sp500", notes: "Close to the long-run historical average of ~10%." },

  // --- Current whole life dividend interest rates (declared, not guaranteed) ---
  { id: "wl-dir-massmutual-2026", assetClass: "WHOLE_LIFE_DIVIDEND", carrier: "MassMutual", label: "2026 dividend interest rate", value: 6.60, unit: "% DIR", asOfDate: "2025-10-01", sourceId: "massmutual-2026-dividend", notes: "Record $2.9B total payout for 2026. DIR is one input to the actual dividend, not the policyholder's realized return." },
  { id: "wl-dir-guardian-2026", assetClass: "WHOLE_LIFE_DIVIDEND", carrier: "Guardian Life", label: "2026 dividend interest rate", value: 6.25, unit: "% DIR", asOfDate: "2025-11-01", sourceId: "guardian-dividend" },
  { id: "wl-dir-nwm-2025", assetClass: "WHOLE_LIFE_DIVIDEND", carrier: "Northwestern Mutual", label: "2025 dividend interest rate", value: 5.50, unit: "% DIR", asOfDate: "2025-01-01", sourceId: "northwestern-mutual-dir" },
  { id: "wl-dir-nyl-30y", assetClass: "WHOLE_LIFE_DIVIDEND", carrier: "New York Life", label: "30-year average dividend interest rate (1993-2022)", periodYears: 30, startYear: 1993, endYear: 2022, value: 6.85, unit: "% average DIR", asOfDate: "2022-12-31", sourceId: "insurance-geek-dir-history" },

  // --- IUL historical crediting (carrier-specific, since product launch — not an industry average) ---
  { id: "iul-omaha-since-2016-a", assetClass: "IUL_CREDITING", carrier: "Mutual of Omaha", label: "Average annual crediting rate since product launch (100% participation strategy)", startYear: 2016, endYear: 2025, value: 8.16, unit: "% average crediting rate", asOfDate: "2025-03-10", sourceId: "mutual-of-omaha-iul", notes: "Single carrier, single strategy. Not an industry average; cap rates have fallen over time so future crediting is likely lower." },
  { id: "iul-modeled-20y-irr", assetClass: "IUL_CREDITING", label: "Modeled 20-year IRR under a 10% cap (illustrative, not observed)", periodYears: 20, value: 5.65, unit: "% IRR", asOfDate: "2025-01-01", sourceId: "wealthmanagement-iul-critique", notes: "A hypothetical model, not real policy history. Shows why 'average return' and IRR diverge for capped index strategies." },

  // --- Annuity market trends ---
  { id: "annuity-total-2025", assetClass: "ANNUITY_SALES_TOTAL", label: "Total U.S. retail annuity sales, 2025 (record year)", startYear: 2025, endYear: 2025, value: 464.1, unit: "$ billions", asOfDate: "2025-12-31", sourceId: "limra-2025-annuity-sales" },
  { id: "fia-sales-2025", assetClass: "FIA_SALES", label: "Fixed indexed annuity (FIA) sales, 2025 (5th straight record year)", startYear: 2025, endYear: 2025, value: 127.9, unit: "$ billions", asOfDate: "2025-12-31", sourceId: "limra-2025-annuity-sales" },
  { id: "annuity-indexed-share-2025", assetClass: "ANNUITY_SALES_TOTAL", label: "Indexed products' share of total annuity sales (up from 24% a decade ago)", startYear: 2025, endYear: 2025, value: 45, unit: "% of total sales", asOfDate: "2025-12-31", sourceId: "limra-2025-annuity-sales" },

  // --- 2026 contribution limits (tax planning reference) ---
  { id: "limit-401k-2026", assetClass: "CONTRIBUTION_LIMIT", label: "401(k) employee contribution limit, 2026", startYear: 2026, value: 24500, unit: "$", asOfDate: "2025-11-01", sourceId: "irs-2026-limits" },
  { id: "limit-ira-2026", assetClass: "CONTRIBUTION_LIMIT", label: "Traditional/Roth IRA contribution limit, 2026", startYear: 2026, value: 7500, unit: "$", asOfDate: "2025-11-01", sourceId: "irs-2026-limits" },
  { id: "limit-roth-phaseout-mfj-2026", assetClass: "CONTRIBUTION_LIMIT", label: "Roth IRA income phase-out, married filing jointly, 2026", startYear: 2026, value: 252000, unit: "$ upper bound", asOfDate: "2025-11-01", sourceId: "irs-2026-limits", notes: "Phase-out range starts at $242,000." },
]

export const knowledgeTopics: KnowledgeTopic[] = [
  {
    id: "roth-vs-perm",
    slug: "roth-vs-permanent-life-insurance",
    category: "ROTH_VS_PERM",
    title: "Roth IRA vs. cash-value (permanent) life insurance",
    summary:
      "Both can produce tax-free income in retirement, but they get there differently: a Roth IRA has contribution limits and income caps; a properly structured permanent policy doesn't, but carries insurance costs and needs ongoing funding discipline.",
    body: [
      "A Roth IRA grows tax-free and comes out tax-free in retirement, but 2026 contributions are capped at $7,500 (plus a $1,100 catch-up at 50+), and the ability to contribute directly phases out above $242,000-$252,000 of income for a married couple filing jointly.",
      "Cash-value life insurance (whole life or IUL) has no IRS contribution cap and no income phase-out. Policy loans against cash value are generally not taxed as income if the policy stays in force and isn't a Modified Endowment Contract (MEC). The trade-off: a portion of every premium pays for the insurance itself and carrier expenses, so early-year cash value growth is slower than a direct market investment, and the policy must be funded consistently to avoid lapsing (which can trigger tax on the gain).",
      "Current whole life dividend interest rates from major mutuals run roughly 5.5%-6.6% for 2025-2026 (MassMutual 6.60%, Guardian 6.25%, Northwestern Mutual 5.50%), up for a second straight year. That rate is one input to the actual dividend, not the client's realized return — illustrate net-of-cost numbers, not the headline DIR.",
      "A fair comparison needs three numbers side by side for the same client: the Roth's realistic contribution ceiling, the policy's illustrated net return after costs, and the client's actual ability to max out tax-advantaged room elsewhere (401(k), HSA) before adding a permanent policy as a supplemental bucket.",
    ],
    dataPointIds: ["limit-ira-2026", "limit-roth-phaseout-mfj-2026", "wl-dir-massmutual-2026", "wl-dir-guardian-2026", "wl-dir-nwm-2025", "wl-dir-nyl-30y"],
    sourceIds: ["irs-2026-limits", "massmutual-2026-dividend", "guardian-dividend", "northwestern-mutual-dir", "insurance-geek-dir-history"],
  },
  {
    id: "term-plus-sp500-vs-perm",
    slug: "term-plus-sp500-vs-permanent-insurance",
    category: "TERM_PLUS_INVEST_VS_PERM",
    title: "\"Buy term, invest the difference\" vs. permanent insurance",
    summary:
      "Term + S&P 500 has historically outgrown permanent insurance's illustrated returns over long horizons — but only if the client actually invests the difference every year and can tolerate market drawdowns. Permanent insurance trades upside for guarantees and discipline.",
    body: [
      "Over the last 30 years (1996-2025), the S&P 500 returned roughly 10.4% annualized (Fidelity, average of monthly returns, with dividends); the trailing 20-year figure is about 11.0%, and the most recent 10- and 5-year windows ran even hotter at 14.8% and 14.4% — a reminder that trailing windows are highly dependent on the start and end date chosen.",
      "Whole life dividend interest rates (not the same as net policyholder return, which runs lower after costs) sit around 5.5%-6.6% for 2025-2026 across the major mutuals. A 30-year average for New York Life (1993-2022) was 6.85%. Indexed universal life crediting is harder to generalize: Mutual of Omaha discloses an 8.16% average crediting rate since its product launched in 2016 on one strategy, but a third-party modeled analysis shows that under a 10% cap, a 20-year internal rate of return is closer to 5.65% — average crediting rate and realized IRR are not the same number, and cap rates have been falling industry-wide.",
      "The honest framing for a client: term + S&P 500 has won on pure historical return in almost every rolling long-term period, but it requires (a) actually investing the premium difference every single year without fail, (b) tolerating 30-50% drawdowns without selling, and (c) term coverage ending at a fixed age. Permanent insurance gives up a lot of that upside for guaranteed death benefit, tax-deferred/tax-free access to cash value, and no market risk on the insurance piece — which matters most for clients who know they won't actually invest the difference, or who need coverage past age 65-70.",
      "This is a 'both, in proportion' conversation more often than an either/or one: term for the temporary, high-coverage need; a smaller permanent policy for the permanent need (estate liquidity, business buy-sell, special-needs planning); the rest invested.",
    ],
    dataPointIds: ["sp500-5y", "sp500-10y", "sp500-20y", "sp500-30y", "wl-dir-nyl-30y", "iul-omaha-since-2016-a", "iul-modeled-20y-irr"],
    sourceIds: ["fidelity-sp500", "insurance-geek-dir-history", "mutual-of-omaha-iul", "wealthmanagement-iul-critique"],
  },
  {
    id: "annuity-trends",
    slug: "annuity-vs-insurance-investment-trends",
    category: "ANNUITY_TRENDS",
    title: "Annuity vs. insurance-as-investment trends",
    summary:
      "Annuity sales just hit a fourth-straight record year ($464.1B in 2025), driven by indexed products — a sign clients are prioritizing guaranteed income over market-linked life insurance cash value right now.",
    body: [
      "LIMRA's final 2025 numbers show U.S. retail annuity sales hit a record $464.1 billion, the fourth consecutive record year. Fixed indexed annuities (FIAs) alone hit $127.9 billion — a fifth straight year of growth and a new record.",
      "Indexed products (FIAs plus registered index-linked annuities) now make up 45% of total annuity sales, nearly double their 24% share a decade ago. That's the clearest read on where the 'guaranteed-ish income with some upside' demand is actually going: more into annuities than into IUL death-benefit policies bought primarily as investment vehicles.",
      "LIMRA expects Federal Reserve rate cuts to cool fixed annuity growth somewhat in 2026, but still projects total sales to stay above $450 billion through 2028 — this is a durable shift, not a one-year spike tied to 2022-2023 rate hikes.",
      "For a client torn between an annuity and a cash-value life policy as their 'safe money' bucket: an annuity is purpose-built for income and principal protection with no death-benefit multiplier; permanent life insurance is purpose-built for a tax-free death benefit with cash value as a secondary feature. Choosing based on which one is trending is backwards — the trend is useful context, not the deciding factor.",
    ],
    dataPointIds: ["annuity-total-2025", "fia-sales-2025", "annuity-indexed-share-2025"],
    sourceIds: ["limra-2025-annuity-sales"],
  },
  {
    id: "tax-saving-ideas",
    slug: "tax-saving-ideas",
    category: "TAX_SAVINGS",
    title: "Tax-saving ideas worth raising in a review",
    summary:
      "2026 brings higher contribution limits across the board — 401(k) to $24,500, IRA to $7,500, HSA to $4,400/$8,750 — plus perennial moves like Roth conversions and using cash-value life insurance's tax treatment deliberately.",
    body: [
      "2026 limits (IRS, announced Nov 2025): 401(k) employee deferral $24,500 (+$8,000 catch-up at 50+, $32,500 total); IRA $7,500 (+$1,100 catch-up); HSA $4,400 self-only / $8,750 family (+$1,000 catch-up at 55+). Roth IRA direct-contribution phase-out is $153,000-$168,000 single, $242,000-$252,000 married filing jointly — above that, a backdoor Roth conversion is the usual workaround.",
      "Backdoor/mega backdoor Roth: contribute to a traditional IRA (no income limit on the contribution itself) and convert to Roth; for 401(k) plans that allow after-tax contributions and in-service conversions, the 'mega backdoor' can move far more than the standard IRA limit into Roth space in a single year.",
      "Life insurance cash value grows tax-deferred, and policy loans are typically income-tax-free while the policy is in force and not a MEC — useful as a supplemental, non-correlated income source in low-tax-bracket retirement years, or to avoid realizing capital gains in a down market.",
      "HSAs are the only triple-tax-advantaged account (deductible in, tax-free growth, tax-free out for qualified medical expenses) — for a healthy client already maxing a 401(k) match, this is usually the next dollar, ahead of a taxable brokerage account.",
    ],
    dataPointIds: ["limit-401k-2026", "limit-ira-2026", "limit-roth-phaseout-mfj-2026"],
    sourceIds: ["irs-2026-limits"],
  },
  {
    id: "college-planning",
    slug: "college-planning-how-to",
    category: "COLLEGE_PLANNING",
    title: "College planning: 529s, FAFSA, and where life insurance fits",
    summary:
      "A parent-owned 529 counts as a parent asset on the FAFSA; cash value in a life insurance policy does not. That single rule drives a lot of 'where should this money sit' decisions for families close to applying for aid.",
    body: [
      "Per the Federal Student Aid Handbook, the cash value or equity of a life insurance policy (term or permanent) is not reported as an asset on the FAFSA. If a death benefit or cash value is withdrawn and deposited into a bank or brokerage account, however, that cash balance becomes a reportable asset going forward.",
      "A parent-owned 529 plan is reported as a parent asset on the FAFSA, even if the account names a sibling as beneficiary. Parent assets are assessed far more gently than student assets (roughly up to 5.64% counted toward the expected family contribution, vs. 20% for a student-owned asset), so a 529 is still usually favorable relative to UGMA/UTMA accounts titled in the child's name.",
      "A grandparent-owned 529 is not reported as an asset at all on the FAFSA — but distributions from it are reported as untaxed income to the student the following year, which can hit aid eligibility harder than simply holding the asset would have. Timing grandparent-owned 529 withdrawals (e.g., the student's final semester, after the last FAFSA is filed) avoids that hit.",
      "Note the CSS Profile (used by many private colleges in addition to the FAFSA) can include cash value life insurance as an asset — so this strategy is FAFSA-specific, not universal. Always check the specific schools on the client's list before leaning on this.",
      "Practical sequencing for a family with both goals: fund the 529 enough to capture any state tax deduction, keep a permanent life policy's cash value as the 'FAFSA-invisible' overflow bucket, and route grandparent 529 money to come out only after the last financial-aid application is filed.",
    ],
    dataPointIds: [],
    sourceIds: ["savingforcollege-fafsa-assets", "collegeinvestor-life-insurance-fafsa"],
  },
]

export function getTopicsByCategory(category: KnowledgeCategory) {
  return knowledgeTopics.filter((t) => t.category === category)
}

export function getDataPoint(id: string) {
  return marketDataPoints.find((d) => d.id === id)
}

export function getSource(id: string) {
  return dataSources.find((s) => s.id === id)
}
