import Link from "next/link"

type Variant = "banner" | "inline" | "footer"

export function ComplianceDisclaimer({ variant = "inline" }: { variant?: Variant }) {
  if (variant === "banner") {
    return (
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-900">
        Educational content only — not insurance, tax, or investment advice.{" "}
        <Link href="/licenses" className="underline font-medium">
          Disclosures &amp; licenses
        </Link>
      </div>
    )
  }

  if (variant === "footer") {
    return (
      <p className="text-xs text-gray-600 leading-relaxed">
        <strong>Regulatory notice:</strong> Safora provides educational financial planning tools and
        class information. We are not a broker-dealer, investment adviser, or insurance company.
        Tools produce illustrative outputs only. Consult licensed professionals before making financial
        or insurance decisions. See{" "}
        <Link href="/licenses" className="text-blue-600 hover:underline">
          Licenses &amp; Disclaimers
        </Link>
        .
      </p>
    )
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
      <strong className="font-semibold">Educational use only.</strong> Calculators and illustrative
      outputs on this site are for learning purposes. They do not constitute insurance, tax, legal,
      or investment advice. Past performance and estimates do not guarantee future results.
    </div>
  )
}
