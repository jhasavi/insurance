// S&P 500 total return by calendar year (price return + reinvested dividends).
// Source: Slickcharts, "S&P 500 Total Returns by Year Since 1926"
// https://www.slickcharts.com/sp500/returns — retrieved 2026-11-20.
// Historical only. Not a prediction of future returns.

export const SP500_SOURCE = {
  name: "S&P 500 Total Returns by Year Since 1926",
  publisher: "Slickcharts",
  url: "https://www.slickcharts.com/sp500/returns",
  retrievedAt: "2026-11-20",
}

// Percent total return, e.g. -37.00 means -37.00% that year.
export const sp500AnnualReturns: Record<number, number> = {
  1995: 37.58, 1996: 22.96, 1997: 33.36, 1998: 28.58, 1999: 21.04,
  2000: -9.10, 2001: -11.89, 2002: -22.10, 2003: 28.68, 2004: 10.88,
  2005: 4.91, 2006: 15.79, 2007: 5.49, 2008: -37.00, 2009: 26.46,
  2010: 15.06, 2011: 2.11, 2012: 16.00, 2013: 32.39, 2014: 13.69,
  2015: 1.38, 2016: 11.96, 2017: 21.83, 2018: -4.38, 2019: 31.49,
  2020: 18.40, 2021: 28.71, 2022: -18.11, 2023: 26.29, 2024: 25.02,
  2025: 17.88,
}

export const SP500_YEARS = Object.keys(sp500AnnualReturns).map(Number).sort()
export const SP500_FIRST_YEAR = SP500_YEARS[0]
export const SP500_LAST_YEAR = SP500_YEARS[SP500_YEARS.length - 1]

// Years widely remembered as "the worst time to retire" — surfaced as quick-pick
// starting points since that's exactly the scenario a skeptical client will ask about.
export const NOTABLE_START_YEARS = [
  { year: 2000, label: "2000 — dot-com peak" },
  { year: 2007, label: "2007 — just before the financial crisis" },
  { year: 2008, label: "2008 — financial crisis" },
  { year: 1995, label: "1995 — best-case run" },
]
