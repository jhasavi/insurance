/** Compliance copy for /tools/balance — single source for UI and exports */

export const BALANCE_RESULTS_DISCLAIMER =
  "Educational planning tool only. Not tax, legal, investment, Medicare, or insurance advice. Results are hypothetical and should be reviewed with qualified professionals."

export const BALANCE_PROFESSIONAL_SUFFIX =
  "Subject to eligibility, policy design, underwriting, tax rules, and compliance review."

export const CONTEXTUAL_DISCLAIMERS = {
  roth:
    "Actual tax impact depends on federal/state taxes, Medicare premiums, Social Security taxation, available cash, and client-specific facts.",
  lifeInsurance:
    "Policy suitability depends on need, affordability, underwriting, guarantees, fees, charges, policy design, and long-term funding.",
  medicare:
    "Medicare premiums and IRMAA thresholds may change and should be verified using official sources.",
  socialSecurity:
    "Claiming decisions depend on health, longevity, spouse benefits, cash flow, and tax situation.",
  ltc:
    "Coverage, triggers, tax treatment, and benefits vary by policy and state.",
} as const

export type ContextualTopic = keyof typeof CONTEXTUAL_DISCLAIMERS

export function contextualDisclaimer(topic: ContextualTopic): string {
  return CONTEXTUAL_DISCLAIMERS[topic]
}
