/**
 * Static copy for advisor explanation mode — edit here; logic lives in planning-rules.ts.
 * Structured for future LLM prompt assembly (scenario + observations + flags).
 */

export const ADVISOR_EXPLANATION_DISCLAIMER =
  "This is an educational advisor-support tool. It does not provide tax, legal, investment, Medicare, or insurance advice and does not replace individualized suitability, underwriting, compliance, or professional review."

export const STRATEGY_PHRASES = {
  rothConversion:
    "Consider reviewing partial Roth conversion opportunities with a tax professional.",
  socialSecurity:
    "Consider comparing Social Security claiming ages and survivor benefit impact.",
  lifeNeeds:
    "Consider a life insurance needs analysis — protection amount vs. duration of need.",
  termVsPermanent:
    "Consider term vs. permanent fit based on how long the need may last.",
  ltcFunding:
    "Consider long-term care funding options and liquidity if care is needed.",
  beneficiaryReview:
    "Consider beneficiary designations and estate document review with qualified counsel.",
  emergencyReserve:
    "Consider strengthening liquid reserves before increasing investment or conversion activity.",
  realEstateLiquidity:
    "Consider how real estate would be managed or liquidated without forced sale timing.",
  medicareIrmaa:
    "Consider coordinating large income events with Medicare premium thresholds.",
  rmdPlanning:
    "Consider estimating future RMDs and bracket impact with a tax advisor.",
} as const

export const CLIENT_QUESTION_BANK = {
  rmd: "Have you estimated required minimum distributions and how they may affect your tax bracket?",
  rothRoom: "Are there years before RMDs when your taxable income may be lower — creating room to discuss Roth conversions?",
  ssClaiming:
    "What ages are you comparing for Social Security — and how would survivor benefits factor in for your spouse?",
  medicare:
    "Are you within two years of Medicare, and could a large IRA withdrawal or conversion affect premiums?",
  insuranceNeed:
    "If income stopped tomorrow, which expenses and promises would still need to be funded — and for how long?",
  termExpiry:
    "When does your term insurance end, and will you still have the same protection need at that age?",
  ltc:
    "If you needed help at home for three years, which account would you draw from first?",
  survivor:
    "If one spouse passed away, how might taxes and household income change for the survivor?",
  taxBuckets:
    "Do you know how much wealth sits in taxable, tax-deferred, and tax-free accounts today?",
  estateDocs:
    "When were beneficiary designations and estate documents last reviewed?",
  realEstate:
    "If rental or investment property had to be sold quickly, would the family have other liquidity?",
  emergency:
    "How many months of expenses could you cover from cash without selling investments?",
} as const

export const DO_NOT_CONCLUDE = {
  rothConversion:
    "Do not automatically recommend Roth conversion without reviewing taxes, Medicare, cash flow, state rules, and available cash to pay tax.",
  lifeInsurance:
    "Do not recommend a product type until need duration, budget, health, and underwriting are discussed.",
  socialSecurity:
    "Do not state that delaying is always best — health, cash flow, and spouse protection vary.",
  permanentInsurance:
    "Do not position permanent insurance as default protection — match product type to need duration and purpose.",
  ltc:
    "Do not assume one LTC funding path fits all clients — preferences and state rules differ.",
  realEstate:
    "Do not assume property should be sold or retained without family goals and tax counsel.",
} as const
