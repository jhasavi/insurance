import {
  buildBalanceExportPayload,
  parseBalanceImportFile,
} from '../src/lib/balance-persistence'
import { defaultAdvisorFields } from '../src/components/AdvisorScenarioFields'

const sample = buildBalanceExportPayload(
  {
    age: 45,
    annualIncome: 100000,
    monthlyExpenses: 5000,
    accounts: [{ category: 'emergency', label: 'E', balance: 10000 }],
    termLifeCoverage: 500000,
    permLifeDeathBenefit: '',
    cashValueLife: '',
    hasDependents: true,
    maritalStatus: 'married',
    spouseIncome: 80000,
    spouseRetirement: '',
    dependentCount: 2,
    collegeFunding: '',
    active401k: '',
    old401k: '',
    primaryHome: '',
    rentalEquity: '',
    overseasAssets: '',
    cryptoAssets: '',
    healthConcerns: false,
    immigrationUncertain: false,
    advisorMode: false,
    advisorFields: defaultAdvisorFields(),
    result: null,
    advisorExplanation: null,
  },
  {
    maritalStatus: 'married',
    spouseAnnualIncome: 80000,
    termLifeCoverage: 500000,
    dependentCount: 2,
  }
)

const roundTrip = parseBalanceImportFile(JSON.stringify(sample))
if (!roundTrip.ok) {
  throw new Error(`Import failed: ${roundTrip.error}`)
}
if (roundTrip.partial.age !== 45) {
  throw new Error('Age not restored')
}
if (roundTrip.partial.termLifeCoverage !== 500000) {
  throw new Error('Term life not restored from lifeContext')
}

const bad = parseBalanceImportFile('{not json')
if (bad.ok) {
  throw new Error('Expected invalid JSON to fail')
}

console.log('balance-persistence: all checks passed')
