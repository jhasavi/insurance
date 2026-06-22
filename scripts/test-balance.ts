import { analyzeBalance } from '../src/lib/financial-balance'

const basic = analyzeBalance({
  age: 35,
  annualIncome: 100000,
  monthlyExpenses: 5000,
  accounts: [
    { category: 'emergency', label: 'Emergency', balance: 5000, monthlyContribution: 200 },
    { category: 'retirement_tax_deferred', label: '401k', balance: 50000, monthlyContribution: 500 },
    { category: 'retirement_roth', label: 'Roth', balance: 0, monthlyContribution: 0 },
    { category: 'taxable_brokerage', label: 'Brokerage', balance: 30000, monthlyContribution: 300 },
    { category: 'real_estate', label: 'RE', balance: 200000 },
  ],
  hasDependents: true,
})

if (basic.emergencyFundMonths >= 3) {
  throw new Error('Expected emergency fund warning for basic case')
}

const immigration = analyzeBalance({
  age: 40,
  annualIncome: 90000,
  monthlyExpenses: 4000,
  accounts: [
    { category: 'emergency', label: 'Emergency', balance: 12000, monthlyContribution: 0 },
    { category: 'retirement_tax_deferred', label: '401k', balance: 80000, monthlyContribution: 400 },
  ],
  lifeContext: { immigrationUncertain: true, maritalStatus: 'married', spouseAnnualIncome: 70000 },
})

const lifeSum = analyzeBalance({
  age: 38,
  annualIncome: 150000,
  monthlyExpenses: 7000,
  accounts: [{ category: 'emergency', label: 'E', balance: 30000 }],
  hasDependents: true,
  lifeContext: { termLifeCoverage: 500000, permanentLifeDeathBenefit: 250000 },
})

if (lifeSum.lifeCoverage.total !== 750000) {
  throw new Error('Expected term + permanent death benefits to sum')
}
if (lifeSum.insuranceCoverageRatio < 4) {
  throw new Error('Expected combined coverage ratio to reflect both policies')
}

if (immigration.emergencyFundTargetMonths < 9) {
  throw new Error('Expected higher emergency target for immigration uncertainty')
}

if (!immigration.recommendations.some((r) => r.title.includes('liquidity') || r.title.includes('emergency'))) {
  throw new Error('Expected immigration-related liquidity recommendation')
}

console.log('financial-balance unit tests passed')
