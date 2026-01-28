# Agent One-Pager — Life Insurance Recommendation Tool

Purpose: A one-page briefing you can show leadership or agents summarizing what the tool offers and why it's valuable.

Key points
- Tool: `/life-insurance` — multi-step DIME-based recommendation engine (Age, Income, Debt, Mortgage, Children, Goal).
- Recommendation logic: DIME coverage calculation and simple, auditable rules to recommend `Level Term` vs `Whole Life` and suggest term length.

What to show the boss
- Live demo of the tool: enter sample data -> show calculated coverage and recommended product.
- One-pager export (Print) that formats the recommendation, carrier matches, and a quick underwriting snapshot.
- Explainability: show the DIME calculation breakdown and term-length heuristics.

Immediate benefits
- Faster lead qualification: agents get a quick, defensible coverage number and product suggestion.
- Sales enablement: copy/download JSON and print one-pager for client conversations.
- Easy to extend: mapping to carrier product codes (Transamerica/WFG) and adding premium estimates or application flow.

Next actions recommended
1. Confirm exact Transamerica & WFG product names and product codes to map to recommendations.
2. Add premium estimate module (carrier rate tables or sample ranges).
3. Integrate save-to-CRM and agent notes pipeline.
