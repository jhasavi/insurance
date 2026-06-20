import { analyzeBalance } from '../src/lib/financial-balance'

const result = analyzeBalance({
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
  lifeInsuranceCoverage: 500000,
  hasDependents: true,
})

if (result.emergencyFundMonths >= 3) {
  throw new Error('Expected emergency fund months below 3')
}

if (result.recommendations.length === 0) {
  throw new Error('Expected at least one recommendation')
}

console.log('financial-balance unit test passed:', result.recommendations[0]?.title)
