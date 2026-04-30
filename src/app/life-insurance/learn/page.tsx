import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Life Insurance Knowledge Base | Learn Term, IUL & Whole Life',
  description:
    'Deep-dive guides for advisors and clients: Term vs IUL vs Whole Life, how coverage is calculated, underwriting tips, Boston/Massachusetts context, and more.',
}

const topics = [
  {
    id: 'term',
    icon: '📋',
    title: 'Term Life Insurance',
    subtitle: 'The straightforward income-replacement workhorse',
    body: `Term life pays a death benefit if the insured dies within the policy period (10, 20, or 30 years). 
    There is no cash value — the entire premium buys pure protection, so premiums are the lowest of any permanent solution.`,
    bullets: [
      'Best for: Young families replacing a primary income, mortgage protection, SBA loan collateral.',
      'Sweet spot ages: 25–45. Premiums roughly double every 10 years of delay.',
      'Key underwriting factors: BMI, blood pressure, tobacco use, family history (heart disease before 60).',
      'Conversion privilege: Most carrier term products allow conversion to a permanent policy without a new medical exam before age 65.',
      'Massachusetts note: All term policies sold in MA must include a free look period of at least 10 days.',
    ],
    advisorTip:
      'Lead with term when the client has a tight budget. A $500,000/20-year term for a 35-year-old non-smoker runs $25–$35/month. That's hard to refuse.',
  },
  {
    id: 'iul',
    icon: '📈',
    title: 'Indexed Universal Life (IUL)',
    subtitle: 'Market-linked growth with a floor — no losses in a down year',
    body: `IUL ties the cash-value growth to an equity index (typically S&P 500) with a cap (often 10–14%) and a 0% floor. 
    Premiums are flexible and cash value can be accessed via policy loans tax-free in retirement.`,
    bullets: [
      'Best for: Clients who have maxed out 401(k)/Roth IRA and want tax-advantaged growth, business owners, high-earners aged 30–50.',
      'Participation rate: Typically 100% up to cap. A 0% floor means you don't lose cash value when the market drops.',
      'Loan provisions: Policy loans are not taxable events. Withdraw basis (premiums paid) tax-free, then borrow against growth.',
      'Illustration caution: Regulators require illustrations at a "disciplined current rate" (Actuarial Guideline 49A). Beware of over-illustrated max rate scenarios.',
      'MA-specific: Massachusetts does not have a state income tax on life insurance policy loans — a real advantage for retirement income planning.',
    ],
    advisorTip:
      'IUL works best funded at or near the MEC limit (Modified Endowment Contract). Show clients a 25-year ledger side-by-side with their taxable brokerage account.',
  },
  {
    id: 'whole',
    icon: '🏦',
    title: 'Whole Life Insurance',
    subtitle: 'Guaranteed growth, guaranteed death benefit — the foundation asset',
    body: `Whole life provides permanent coverage with a guaranteed cash value that grows at a declared rate (typically 3–4%).
    Dividends from participating policies can be used to buy paid-up additions (PUA), compounding growth.`,
    bullets: [
      'Best for: Clients who want certainty, estate planning (ILIT), legacy/wealth transfer, business buy-sell agreements.',
      'Paid-up additions rider: Using dividends to buy PUA is one of the most powerful wealth-building mechanisms in the product.',
      'Guaranteed issue whole life: Available up to $25,000 without medical underwriting — useful for final expenses, age 50–85.',
      'Participating vs. non-participating: Mutual companies (e.g., MassMutual, Guardian, Northwestern) pay dividends; stock companies generally don't.',
      'Boston/MA advantage: Massachusetts Mutual Life (MassMutual) is headquartered in Springfield, MA — strong local relationship and competitive dividend history.',
    ],
    advisorTip:
      'Frame whole life as "the bond portion of the portfolio that also pays a death benefit." Clients who understand asset allocation respond well to this framing.',
  },
  {
    id: 'coverage',
    icon: '🔢',
    title: 'How Much Coverage?',
    subtitle: 'DIME method and income replacement rules',
    body: `There are several frameworks for coverage calculation. The most robust is DIME: Debt + Income (10x) + Mortgage + Education.`,
    bullets: [
      'DIME formula: Total all debts + 10× annual income + outstanding mortgage balance + estimated college costs per child.',
      'Human Life Value (HLV): PV of all future earnings, discounted at 4–5%. More accurate but harder to explain to clients.',
      'Existing coverage offset: Always subtract existing group life (typically 1–2× salary from employer) from the gap calculation.',
      'Social Security survivor benefit: Dependent children receive ~75% of parent's PIA; surviving spouse with child in care receives ~75% of PIA. Factor this in to avoid over-insurance.',
      'Underinsurance gap (US): The average American household is underinsured by ~$200,000 according to LIMRA research.',
    ],
    advisorTip:
      'Run the DIME calculation live with the client. Let them fill in the numbers. People trust recommendations they helped build.',
  },
  {
    id: 'underwriting',
    icon: '🏥',
    title: 'Underwriting & Health Classes',
    subtitle: 'Know the rating tiers before you submit',
    body: `Understanding health classification helps you set client expectations and choose the right carrier pre-submission.`,
    bullets: [
      'Preferred Plus / Super Preferred: Best rates. Requires excellent vitals, clean family history, no tobacco, ideal BMI (typically 18–27).',
      'Preferred: Minor deviation from perfect — slightly elevated BP managed with one medication, BMI up to ~30.',
      'Standard Plus / Standard: Moderate health issues. BP or cholesterol on multiple medications, BMI 30–35.',
      'Table Rating (Substandard): Rated up due to chronic conditions, DUI history, hazardous occupation. Typically Table B–H at +25%–+200% premium.',
      'Simplified / Guaranteed Issue: No exam products for smaller face amounts. Useful for clients who can't pass full underwriting.',
    ],
    advisorTip:
      'Use informal inquiry (trial application) with 2–3 carriers before formal submission. This prevents multiple MIB (Medical Information Bureau) hits and lets you shop the best rate.',
  },
  {
    id: 'objections',
    icon: '🗣️',
    title: 'Common Objections & Responses',
    subtitle: 'Turn hesitation into commitment',
    body: `The most common reasons clients delay life insurance — and the fact-based responses that move them forward.`,
    bullets: [
      '"I\'ll think about it." → Ask: "What specifically is holding you back?" Then address that specific concern. Delay costs money — premiums increase ~8–10% per year of age.',
      '"It\'s too expensive." → Compare to their cable bill ($120/mo). A $500K/20yr term is often $25–$40/month. Show value vs. cost.',
      '"I have coverage through work." → Group life is typically 1–2× salary. Portability risk: they lose it if they change jobs. Supplement with individual policy.',
      '"I\'m young and healthy, I don\'t need it." → Being young and healthy is exactly why premiums are lowest RIGHT NOW. Lock in the rate today.',
      '"I don\'t believe in life insurance." → Reframe: "This isn\'t for you — it\'s for your family\'s financial plan if something happens to you."',
    ],
    advisorTip:
      'Never argue with an objection. Acknowledge, validate, then pivot with a question. "That makes sense. Can I show you something that might change your perspective?"',
  },
  {
    id: 'ma-context',
    icon: '🏙️',
    title: 'Massachusetts & Boston Context',
    subtitle: 'Local regulations, demographics, and carrier advantages',
    body: `Massachusetts has a highly educated, high-income demographic and a unique regulatory environment that creates specific opportunities for life insurance advisors.`,
    bullets: [
      'MA state tax: Massachusetts has a 5% flat income tax. Policy loan proceeds and death benefits are not subject to MA state income tax.',
      'Estate tax threshold: MA has a separate state estate tax with a $2M exemption (vs $13.6M federal in 2024). Life insurance trusts (ILIT) are popular for estates $2M–$13M.',
      'Immigrant families: Boston has large South Asian, Chinese, and Haitian communities. These demographics historically have strong life insurance purchasing motivation (family protection, remittance, wealth transfer).',
      'Small business density: ~140,000 small businesses in MA. Key-person life, buy-sell, and executive bonus (Section 162) plans are high-opportunity.',
      'MassMutual HQ: Springfield-based mutual insurer with a strong Boston advisor community. Guardian and John Hancock (Boston-based) also have deep market presence.',
    ],
    advisorTip:
      'For immigrant-community clients, lead with the family protection story, not the financial planning story. Protection motivates action; accumulation is a bonus.',
  },
]

export default function LifeInsuranceLearnPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-indigo-300 text-sm font-semibold uppercase tracking-widest mb-3">Advisor Knowledge Base</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Life Insurance Deep Dive</h1>
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto">
            Everything you need to confidently present Term, IUL, and Whole Life — coverage calculations, objection handling, and Massachusetts-specific context.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/life-insurance"
              className="inline-flex items-center px-5 py-2.5 bg-white text-indigo-700 rounded-lg text-sm font-semibold hover:bg-indigo-50"
            >
              Run Recommendation Tool →
            </Link>
            <Link
              href="/life-insurance/scripts"
              className="inline-flex items-center px-5 py-2.5 border border-white/40 text-white rounded-lg text-sm font-semibold hover:bg-white/10"
            >
              Follow-Up Script Library
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Nav */}
      <section className="bg-gray-50 border-b py-4 px-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-2 justify-center">
          {topics.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-full text-xs font-medium text-gray-700 hover:border-indigo-400 hover:text-indigo-700 transition"
            >
              <span>{t.icon}</span>
              {t.title}
            </a>
          ))}
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
        {topics.map((topic) => (
          <section key={topic.id} id={topic.id} className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{topic.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{topic.title}</h2>
                <p className="text-sm text-gray-500">{topic.subtitle}</p>
              </div>
            </div>

            <p className="mt-4 text-gray-700 leading-relaxed">{topic.body}</p>

            <ul className="mt-4 space-y-2">
              {topic.bullets.map((b, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-indigo-500 mt-0.5">▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3">
              <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-1">Advisor Tip</p>
              <p className="text-sm text-indigo-900">{topic.advisorTip}</p>
            </div>

            <div className="mt-6 border-b border-gray-100" />
          </section>
        ))}

        {/* CTA */}
        <section className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to put this knowledge to work?</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Run the Life Insurance Recommendation Tool with your next client and generate a personalized one-pager in under 5 minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/life-insurance"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
            >
              Start Recommendation →
            </Link>
            <Link
              href="/leads"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              View Leads Dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
