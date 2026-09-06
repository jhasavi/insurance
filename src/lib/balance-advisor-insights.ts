/**
 * Advisor insight cards for /tools/balance — editable content, no personalized advice.
 */

import type { ContextualTopic } from "@/lib/balance-disclaimers"

export type AdvisorInsightCard = {
  id: string
  title: string
  question: string
  whyItMatters: string
  advisorNote: string
  nextStep: string
  /** Shown when card expands — topic-specific compliance note */
  topic?: ContextualTopic
}

export const ADVISOR_INSIGHTS_DISCLAIMER =
  "Educational tool only. Not tax, legal, investment, Medicare, or insurance advice. Consult qualified professionals before making decisions."

export const ADVISOR_INSIGHT_CARDS: AdvisorInsightCard[] = [
  {
    id: "tax-bucket-balance",
    title: "Tax Bucket Balance",
    question: "Where is most of the client's money: taxable, tax-deferred, or tax-free?",
    whyItMatters:
      "Heavy tax-deferred balances may create future RMD pressure, Social Security taxation, Medicare premium considerations, and survivor-spouse tax issues — often discussed together, not in isolation.",
    advisorNote:
      "Use this to open a tax diversification conversation — not to recommend a specific product.",
    nextStep:
      "Map assets into taxable, tax-deferred, tax-free, and protection/liquidity buckets.",
  },
  {
    id: "rmd-pressure",
    title: "RMD Pressure",
    question: "Has the client estimated future required minimum distributions?",
    whyItMatters:
      "Traditional IRA and 401(k) balances may create forced taxable income later in retirement.",
    advisorNote: "May be worth reviewing before discussing Roth conversions with a tax professional.",
    nextStep: "Estimate RMD impact at ages 73, 75, 80, and 85 for discussion purposes.",
  },
  {
    id: "social-security-timing",
    title: "Social Security Timing",
    question:
      "Which claiming ages is the client comparing — early, full retirement age, or delayed?",
    whyItMatters:
      "Claiming age may affect lifetime income, survivor benefits, tax planning, and portfolio withdrawal order.",
    advisorNote:
      "Avoid blanket rules like \"always delay.\" Coordinate with health, cash flow, spouse protection, and retirement assets.",
    nextStep: "Compare illustrative claiming scenarios with the client and qualified counsel.",
    topic: "socialSecurity",
  },
  {
    id: "roth-conversion-window",
    title: "Roth Conversion Window",
    question: "Are there low-income years after retirement but before RMDs?",
    whyItMatters:
      "These years could create a planning opportunity to discuss partial Roth conversions at controlled tax rates.",
    advisorNote:
      "Review Medicare IRMAA lookback years, Social Security taxation, state taxes, and available cash to pay conversion tax.",
    nextStep: "Identify bracket room and a reasonable conversion range to discuss — not to execute automatically.",
    topic: "roth",
  },
  {
    id: "medicare-irmaa",
    title: "Medicare IRMAA Awareness",
    question:
      "Could a large Roth conversion, IRA withdrawal, or capital gain affect Medicare premiums?",
    whyItMatters:
      "Medicare premiums may rise for higher-income beneficiaries based on modified adjusted gross income — often using income from two years prior.",
    advisorNote:
      "A tip many generic articles skip: IRMAA planning often starts around age 63, not only at Medicare enrollment.",
    nextStep: "Flag clients age 63+ or already on Medicare for a premium review with official sources.",
    topic: "medicare",
  },
  {
    id: "term-vs-permanent",
    title: "Term vs Permanent Insurance Fit",
    question: "Is the insurance need temporary, lifetime, or mixed?",
    whyItMatters:
      "Term insurance often aligns with temporary needs like mortgage payoff, income replacement, and children's education. Permanent insurance may be discussed when lifetime liquidity, legacy, estate, business, or special-needs planning is in scope.",
    advisorNote: "Start with the problem and duration of need — not the product category.",
    nextStep: "Identify need duration and liquidity purpose with the client.",
    topic: "lifeInsurance",
  },
  {
    id: "survivor-spouse-risk",
    title: "Survivor Spouse Risk",
    question: "What happens financially and tax-wise when the first spouse dies?",
    whyItMatters:
      "Household income may not fall by half, but the survivor may eventually file as single — which can change tax brackets and deductions.",
    advisorNote:
      "Roth planning, life insurance, and income sequencing may be worth discussing with qualified professionals — outcomes vary by state and facts.",
    nextStep: "Model a simplified survivor scenario for discussion purposes only.",
    topic: "socialSecurity",
  },
  {
    id: "long-term-care-risk",
    title: "Long-Term Care Risk",
    question: "If care is needed for three years, which asset pays first?",
    whyItMatters:
      "Medicare generally does not cover long-term custodial care. Care costs may lead to IRA withdrawals, asset sales, or family caregiving.",
    advisorNote:
      "Discuss self-funding, traditional LTC insurance, hybrid life/LTC, Medicaid planning, and family support — without assuming one path fits all.",
    nextStep: "Identify care preferences, liquidity, and spouse-protection needs.",
    topic: "ltc",
  },
  {
    id: "real-estate-investor",
    title: "Real Estate Investor Planning",
    question:
      "If the client owns rental property, would the family have liquidity without selling property quickly?",
    whyItMatters:
      "Real estate wealth can be illiquid. Death, disability, or care needs may create pressure to sell at unfavorable times.",
    advisorNote:
      "Life insurance may sometimes be discussed for estate liquidity or equalization among heirs — subject to underwriting and compliance review.",
    nextStep:
      "Ask what the client wants to happen to properties after death or incapacity.",
  },
  {
    id: "conversation-starter",
    title: "Client Conversation Starter",
    question:
      "What financial promise would fail if this person died, became ill, or had forced taxable income?",
    whyItMatters:
      "This may help shift the discussion from product selection to planning.",
    advisorNote:
      "Use this to move from calculator output to a discovery conversation.",
    nextStep: "Generate three questions the advisor can ask the client in the next meeting.",
  },
]
