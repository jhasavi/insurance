/** Educational reference links shown alongside balance planner recommendations */

export type BalanceReference = {
  label: string
  url: string
}

export const BALANCE_REFERENCES = {
  emergencyFund: {
    label: "CFPB — Emergency savings",
    url: "https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/",
  },
  retirement15Percent: {
    label: "Fidelity — 15% retirement savings guideline",
    url: "https://www.fidelity.com/viewpoints/retirement/how-much-money-should-I-save-each-month",
  },
  rothDiversification: {
    label: "IRS — Roth IRA overview",
    url: "https://www.irs.gov/retirement-plans/roth-iras",
  },
  college529: {
    label: "SEC — 529 plan basics",
    url: "https://www.investor.gov/introduction-investing/general-library/529-plans",
  },
  rollover401k: {
    label: "IRS — Rollovers of retirement plan distributions",
    url: "https://www.irs.gov/retirement-plans/plan-participant-employee/rollovers-of-retirement-plan-and-ira-distributions",
  },
  lifeInsuranceDime: {
    label: "Safora — Life insurance recommendation tool (DIME method)",
    url: "/life-insurance",
  },
  lifeInsuranceNeeds: {
    label: "NAIC — Life insurance buyer's guide",
    url: "https://content.naic.org/sites/default/files/publication-lig-lp.pdf",
  },
  termVsPermanent: {
    label: "III — Types of life insurance",
    url: "https://www.iii.org/article/what-are-different-types-of-life-insurance",
  },
  realEstateConcentration: {
    label: "Namaste Boston Homes — Real estate portfolio guidance",
    url: "https://www.namasteneedham.com",
  },
  rentalReserves: {
    label: "Namaste Boston Homes — Investment property resources",
    url: "https://www.namasteneedham.com",
  },
  fbar: {
    label: "FinCEN — FBAR reporting (foreign accounts)",
    url: "https://www.fincen.gov/report-foreign-bank-and-financial-accounts",
  },
  cryptoRisk: {
    label: "SEC — Crypto asset risks",
    url: "https://www.investor.gov/introduction-investing/general-library/crypto-assets",
  },
  classes: {
    label: "Safora — Upcoming financial planning classes",
    url: "/classes",
  },
} as const satisfies Record<string, BalanceReference>
