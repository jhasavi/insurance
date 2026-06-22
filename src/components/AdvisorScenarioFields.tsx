"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type {
  FilingStatus,
  GoalPriority,
  InsuranceType,
  LtcConcern,
  MedicareStatus,
  RetirementStatus,
  SocialSecurityStatus,
} from "@/lib/planning-rules"

export type AdvisorFieldState = {
  spouseAge: number | ""
  filingStatus: FilingStatus
  plannedRetirementAge: number | ""
  retirementStatus: RetirementStatus
  pensionIncome: number | ""
  ssAt62: number | ""
  ssAtFRA: number | ""
  ssAt70: number | ""
  insuranceType: InsuranceType
  termExpirationAge: number | ""
  mortgageDebt: number | ""
  medicareStatus: MedicareStatus
  socialSecurityStatus: SocialSecurityStatus
  ltcConcern: LtcConcern
  goalPriorities: GoalPriority[]
}

const GOAL_OPTIONS: { id: GoalPriority; label: string }[] = [
  { id: "income_protection", label: "Income protection" },
  { id: "tax_reduction", label: "Tax reduction" },
  { id: "legacy", label: "Legacy" },
  { id: "estate_liquidity", label: "Estate liquidity" },
  { id: "business_planning", label: "Business planning" },
  { id: "retirement_income", label: "Retirement income" },
  { id: "ltc_protection", label: "LTC protection" },
]

export function AdvisorScenarioFields({
  fields,
  onChange,
}: {
  fields: AdvisorFieldState
  onChange: (partial: Partial<AdvisorFieldState>) => void
}) {
  const toggleGoal = (goal: GoalPriority) => {
    const next = fields.goalPriorities.includes(goal)
      ? fields.goalPriorities.filter((g) => g !== goal)
      : [...fields.goalPriorities, goal]
    onChange({ goalPriorities: next })
  }

  return (
    <div className="rounded-lg border border-indigo-200 bg-indigo-50/40 p-4 space-y-4">
      <p className="text-sm text-indigo-900">
        Additional scenario fields for advisor explanations. Consumer balance analysis still uses
        the core form above.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div>
          <Label>Spouse age</Label>
          <Input
            type="number"
            min={18}
            max={100}
            value={fields.spouseAge}
            onChange={(e) =>
              onChange({ spouseAge: e.target.value === "" ? "" : Number(e.target.value) })
            }
          />
        </div>
        <div>
          <Label>Filing status</Label>
          <select
            value={fields.filingStatus}
            onChange={(e) => onChange({ filingStatus: e.target.value as FilingStatus })}
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="mfj">Married filing jointly</option>
            <option value="single">Single</option>
            <option value="mfs">Married filing separately</option>
            <option value="hoh">Head of household</option>
            <option value="qualifying_widow">Qualifying surviving spouse</option>
          </select>
        </div>
        <div>
          <Label>Retirement status</Label>
          <select
            value={fields.retirementStatus}
            onChange={(e) =>
              onChange({ retirementStatus: e.target.value as RetirementStatus })
            }
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="working">Working</option>
            <option value="partially_retired">Partially retired</option>
            <option value="retired">Retired</option>
          </select>
        </div>
        <div>
          <Label>Planned retirement age</Label>
          <Input
            type="number"
            min={50}
            max={85}
            value={fields.plannedRetirementAge}
            onChange={(e) =>
              onChange({
                plannedRetirementAge: e.target.value === "" ? "" : Number(e.target.value),
              })
            }
          />
        </div>
        <div>
          <Label>Pension income (annual $)</Label>
          <Input
            type="number"
            min={0}
            value={fields.pensionIncome}
            onChange={(e) =>
              onChange({ pensionIncome: e.target.value === "" ? "" : Number(e.target.value) })
            }
          />
        </div>
        <div>
          <Label>Mortgage & other debt ($)</Label>
          <Input
            type="number"
            min={0}
            value={fields.mortgageDebt}
            onChange={(e) =>
              onChange({ mortgageDebt: e.target.value === "" ? "" : Number(e.target.value) })
            }
          />
        </div>
        <div>
          <Label>Insurance type</Label>
          <select
            value={fields.insuranceType}
            onChange={(e) => onChange({ insuranceType: e.target.value as InsuranceType })}
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="none">None</option>
            <option value="term">Term</option>
            <option value="permanent">Permanent</option>
            <option value="group">Group</option>
            <option value="mixed">Mixed (term + permanent)</option>
          </select>
        </div>
        <div>
          <Label>Term expires at age</Label>
          <Input
            type="number"
            min={18}
            max={100}
            placeholder="e.g. 65"
            value={fields.termExpirationAge}
            onChange={(e) =>
              onChange({
                termExpirationAge: e.target.value === "" ? "" : Number(e.target.value),
              })
            }
          />
        </div>
        <div>
          <Label>Medicare status</Label>
          <select
            value={fields.medicareStatus}
            onChange={(e) => onChange({ medicareStatus: e.target.value as MedicareStatus })}
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="not_enrolled">Not yet enrolled</option>
            <option value="within_2_years">Within ~2 years</option>
            <option value="enrolled">Enrolled</option>
            <option value="not_applicable">N/A</option>
          </select>
        </div>
        <div>
          <Label>Social Security status</Label>
          <select
            value={fields.socialSecurityStatus}
            onChange={(e) =>
              onChange({ socialSecurityStatus: e.target.value as SocialSecurityStatus })
            }
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="planning">Planning / comparing</option>
            <option value="not_claiming">Not yet claiming</option>
            <option value="claimed">Receiving benefits</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
        <div>
          <Label>Est. SS monthly at 62 ($)</Label>
          <Input
            type="number"
            min={0}
            value={fields.ssAt62}
            onChange={(e) => onChange({ ssAt62: e.target.value === "" ? "" : Number(e.target.value) })}
          />
        </div>
        <div>
          <Label>Est. SS monthly at FRA ($)</Label>
          <Input
            type="number"
            min={0}
            value={fields.ssAtFRA}
            onChange={(e) => onChange({ ssAtFRA: e.target.value === "" ? "" : Number(e.target.value) })}
          />
        </div>
        <div>
          <Label>Est. SS monthly at 70 ($)</Label>
          <Input
            type="number"
            min={0}
            value={fields.ssAt70}
            onChange={(e) => onChange({ ssAt70: e.target.value === "" ? "" : Number(e.target.value) })}
          />
        </div>
        <div>
          <Label>Long-term care concern</Label>
          <select
            value={fields.ltcConcern}
            onChange={(e) => onChange({ ltcConcern: e.target.value as LtcConcern })}
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
          >
            <option value="none">Low / none</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div>
        <Label className="mb-2 block">Goal priorities (select any)</Label>
        <div className="flex flex-wrap gap-3">
          {GOAL_OPTIONS.map((g) => (
            <label key={g.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={fields.goalPriorities.includes(g.id)}
                onChange={() => toggleGoal(g.id)}
                className="h-4 w-4"
              />
              {g.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export function defaultAdvisorFields(): AdvisorFieldState {
  return {
    spouseAge: "",
    filingStatus: "mfj",
    plannedRetirementAge: 65,
    retirementStatus: "working",
    pensionIncome: "",
    ssAt62: "",
    ssAtFRA: "",
    ssAt70: "",
    insuranceType: "none",
    termExpirationAge: "",
    mortgageDebt: "",
    medicareStatus: "not_enrolled",
    socialSecurityStatus: "planning",
    ltcConcern: "none",
    goalPriorities: ["income_protection"],
  }
}
