"use client"

import { useMemo, useState } from "react"
import {
  sp500AnnualReturns,
  SP500_YEARS,
  SP500_LAST_YEAR,
  NOTABLE_START_YEARS,
} from "@/lib/sp500-returns"

type YearRow = {
  year: number
  returnPct: number
  marketOnlyBalance: number
  marketOnlyWithdrew: boolean
  bufferedMarketBalance: number
  bufferBalance: number
  withdrewFromBuffer: boolean
}

const REFILL_THRESHOLD_PCT = 10 // a year this good lets the buffer top back up

function simulate({
  startYear,
  horizonYears,
  startingBalance,
  withdrawalRatePct,
  inflationPct,
  bufferYears,
}: {
  startYear: number
  horizonYears: number
  startingBalance: number
  withdrawalRatePct: number
  inflationPct: number
  bufferYears: number
}): { rows: YearRow[]; marketOnlyDepletedYear: number | null; bufferedDepletedYear: number | null } {
  const firstWithdrawal = startingBalance * (withdrawalRatePct / 100)
  const targetBuffer = firstWithdrawal * bufferYears

  let marketOnlyBalance = startingBalance
  let bufferedMarketBalance = startingBalance - targetBuffer
  let bufferBalance = targetBuffer

  let marketOnlyDepletedYear: number | null = null
  let bufferedDepletedYear: number | null = null

  const rows: YearRow[] = []

  for (let i = 0; i < horizonYears; i++) {
    const year = startYear + i
    const ret = sp500AnnualReturns[year]
    if (ret === undefined) break // ran past available historical data

    const withdrawal = firstWithdrawal * Math.pow(1 + inflationPct / 100, i)

    // Strategy A: 100% market, withdraw every year regardless of return.
    let marketOnlyWithdrew = false
    if (marketOnlyBalance > 0) {
      marketOnlyBalance = Math.max(0, marketOnlyBalance - withdrawal)
      marketOnlyWithdrew = true
      marketOnlyBalance = marketOnlyBalance * (1 + ret / 100)
      if (marketOnlyBalance <= 0 && marketOnlyDepletedYear === null) {
        marketOnlyBalance = 0
        marketOnlyDepletedYear = year
      }
    }

    // Strategy B: market + non-correlated buffer. In a down year, draw the
    // withdrawal from the buffer instead of the market, so the market side
    // isn't forced to sell at a loss. In a strong up year, sweep some of the
    // gain back into the buffer until it's refilled to its original target.
    let withdrewFromBuffer = false
    if (bufferedMarketBalance > 0 || bufferBalance > 0) {
      if (ret < 0 && bufferBalance >= withdrawal) {
        bufferBalance -= withdrawal
        withdrewFromBuffer = true
      } else {
        bufferedMarketBalance = Math.max(0, bufferedMarketBalance - withdrawal)
      }
      bufferedMarketBalance = bufferedMarketBalance * (1 + ret / 100)

      if (ret > REFILL_THRESHOLD_PCT && bufferBalance < targetBuffer) {
        const refill = Math.min(targetBuffer - bufferBalance, withdrawal)
        if (bufferedMarketBalance > refill) {
          bufferedMarketBalance -= refill
          bufferBalance += refill
        }
      }

      if (bufferedMarketBalance <= 0 && bufferBalance <= 0 && bufferedDepletedYear === null) {
        bufferedMarketBalance = 0
        bufferedDepletedYear = year
      }
    }

    rows.push({
      year,
      returnPct: ret,
      marketOnlyBalance,
      marketOnlyWithdrew,
      bufferedMarketBalance,
      bufferBalance,
      withdrewFromBuffer,
    })
  }

  return { rows, marketOnlyDepletedYear, bufferedDepletedYear }
}

function formatUsd(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

function LineChart({ rows }: { rows: YearRow[] }) {
  if (rows.length === 0) return null
  const width = 680
  const height = 260
  const padLeft = 56
  const padBottom = 24
  const padTop = 12
  const innerW = width - padLeft - 12
  const innerH = height - padTop - padBottom

  const maxVal = Math.max(
    1,
    ...rows.map((r) => Math.max(r.marketOnlyBalance, r.bufferedMarketBalance + r.bufferBalance))
  )

  const xFor = (i: number) => padLeft + (i / Math.max(1, rows.length - 1)) * innerW
  const yFor = (v: number) => padTop + innerH - (v / maxVal) * innerH

  const marketPath = rows.map((r, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(r.marketOnlyBalance)}`).join(" ")
  const bufferedPath = rows
    .map((r, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(r.bufferedMarketBalance + r.bufferBalance)}`)
    .join(" ")

  const gridLines = [0, 0.25, 0.5, 0.75, 1]

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="Portfolio balance over time, market-only vs. buffered strategy">
      {gridLines.map((g) => {
        const y = padTop + innerH - g * innerH
        return (
          <g key={g}>
            <line x1={padLeft} y1={y} x2={width - 12} y2={y} stroke="#e2e8f0" strokeWidth={1} />
            <text x={padLeft - 8} y={y + 4} textAnchor="end" fontSize={10} fill="#64748b">
              {formatUsd(Math.round((g * maxVal) / 1000) * 1000)}
            </text>
          </g>
        )
      })}

      {rows.map((r, i) =>
        i % Math.ceil(rows.length / 8 || 1) === 0 ? (
          <text key={r.year} x={xFor(i)} y={height - 6} textAnchor="middle" fontSize={10} fill="#64748b">
            {r.year}
          </text>
        ) : null
      )}

      <path d={marketPath} fill="none" stroke="#dc2626" strokeWidth={2} />
      <path d={bufferedPath} fill="none" stroke="#0f766e" strokeWidth={2} />
    </svg>
  )
}

export function SequenceRiskSimulator() {
  const [startYear, setStartYear] = useState(2000)
  const [startingBalance, setStartingBalance] = useState(1_000_000)
  const [withdrawalRatePct, setWithdrawalRatePct] = useState(4)
  const [inflationPct, setInflationPct] = useState(3)
  const [bufferYears, setBufferYears] = useState(2)
  const [horizonYears, setHorizonYears] = useState(25)

  const { rows, marketOnlyDepletedYear, bufferedDepletedYear } = useMemo(
    () =>
      simulate({
        startYear,
        horizonYears,
        startingBalance,
        withdrawalRatePct,
        inflationPct,
        bufferYears,
      }),
    [startYear, horizonYears, startingBalance, withdrawalRatePct, inflationPct, bufferYears]
  )

  const lastRow = rows[rows.length - 1]
  const marketOnlyEnding = marketOnlyDepletedYear ? 0 : lastRow?.marketOnlyBalance ?? 0
  const bufferedEnding = bufferedDepletedYear ? 0 : (lastRow?.bufferedMarketBalance ?? 0) + (lastRow?.bufferBalance ?? 0)
  const downYearsSkipped = rows.filter((r) => r.withdrewFromBuffer).length
  const maxAvailableHorizon = SP500_LAST_YEAR - startYear + 1

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <label className="text-sm">
          <span className="block font-medium text-gray-700 mb-1">Retirement start year</span>
          <select
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
          >
            {SP500_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <span className="mt-1 flex flex-wrap gap-1.5">
            {NOTABLE_START_YEARS.map((n) => (
              <button
                key={n.year}
                type="button"
                onClick={() => setStartYear(n.year)}
                className="text-[11px] rounded-full border border-slate-200 px-2 py-0.5 text-slate-600 hover:bg-slate-50"
              >
                {n.label}
              </button>
            ))}
          </span>
        </label>

        <label className="text-sm">
          <span className="block font-medium text-gray-700 mb-1">Starting portfolio</span>
          <input
            type="number"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={startingBalance}
            min={10000}
            step={10000}
            onChange={(e) => setStartingBalance(Number(e.target.value) || 0)}
          />
        </label>

        <label className="text-sm">
          <span className="block font-medium text-gray-700 mb-1">Withdrawal rate (year 1)</span>
          <input
            type="number"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={withdrawalRatePct}
            min={1}
            max={10}
            step={0.5}
            onChange={(e) => setWithdrawalRatePct(Number(e.target.value) || 0)}
          />
        </label>

        <label className="text-sm">
          <span className="block font-medium text-gray-700 mb-1">Assumed inflation (withdrawal growth)</span>
          <input
            type="number"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={inflationPct}
            min={0}
            max={8}
            step={0.5}
            onChange={(e) => setInflationPct(Number(e.target.value) || 0)}
          />
        </label>

        <label className="text-sm">
          <span className="block font-medium text-gray-700 mb-1">Buffer bucket size (years of withdrawals)</span>
          <input
            type="number"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={bufferYears}
            min={0}
            max={5}
            step={1}
            onChange={(e) => setBufferYears(Number(e.target.value) || 0)}
          />
        </label>

        <label className="text-sm">
          <span className="block font-medium text-gray-700 mb-1">
            Years to simulate (max {Math.max(1, maxAvailableHorizon)} from {startYear})
          </span>
          <input
            type="number"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            value={horizonYears}
            min={5}
            max={Math.max(5, maxAvailableHorizon)}
            step={1}
            onChange={(e) => setHorizonYears(Number(e.target.value) || 0)}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-700">100% market, no buffer</p>
          <p className="mt-1 text-2xl font-bold text-red-900">
            {marketOnlyDepletedYear ? `Ran out in ${marketOnlyDepletedYear}` : formatUsd(marketOnlyEnding)}
          </p>
          <p className="mt-1 text-xs text-red-700">
            {marketOnlyDepletedYear
              ? "Withdrawals continued on schedule every year, including down years."
              : `Ending balance after ${rows.length} year${rows.length === 1 ? "" : "s"}.`}
          </p>
        </div>
        <div className="rounded-lg border-2 border-teal-200 bg-teal-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
            Market + {bufferYears}-year non-correlated buffer
          </p>
          <p className="mt-1 text-2xl font-bold text-teal-900">
            {bufferedDepletedYear ? `Ran out in ${bufferedDepletedYear}` : formatUsd(bufferedEnding)}
          </p>
          <p className="mt-1 text-xs text-teal-700">
            Skipped market withdrawals in {downYearsSkipped} down year{downYearsSkipped === 1 ? "" : "s"} by
            drawing from the buffer instead.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <LineChart rows={rows} />
        <div className="mt-2 flex gap-4 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-600" /> 100% market
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-teal-700" /> Market + buffer (combined)
          </span>
        </div>
      </div>

      <details className="rounded-lg border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-medium text-gray-800">Year-by-year detail</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-left text-gray-500">
                <th className="py-1.5 pr-3">Year</th>
                <th className="py-1.5 pr-3">S&amp;P 500 return</th>
                <th className="py-1.5 pr-3">100% market balance</th>
                <th className="py-1.5 pr-3">Buffered market balance</th>
                <th className="py-1.5 pr-3">Buffer balance</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.year} className={cnRow(r)}>
                  <td className="py-1 pr-3">{r.year}</td>
                  <td className={`py-1 pr-3 ${r.returnPct < 0 ? "text-red-600" : "text-gray-700"}`}>
                    {r.returnPct.toFixed(2)}%
                  </td>
                  <td className="py-1 pr-3">{formatUsd(r.marketOnlyBalance)}</td>
                  <td className="py-1 pr-3">{formatUsd(r.bufferedMarketBalance)}</td>
                  <td className="py-1 pr-3">
                    {formatUsd(r.bufferBalance)}
                    {r.withdrewFromBuffer && <span className="ml-1 text-teal-700">(drew here)</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}

function cnRow(r: YearRow) {
  return r.returnPct < 0 ? "border-b border-slate-100 bg-red-50/40" : "border-b border-slate-100"
}
