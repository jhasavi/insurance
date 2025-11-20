import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions as any) as { user?: any }
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/auth/signin?callbackUrl=/admin/dashboard")
  }

  // Fetch leads and quotes
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { user: true, intake: true },
  })
  const quotes = await prisma.comparisonQuote.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { carrier: true, user: true },
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-8">
      <Card className="max-w-4xl w-full">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">Recent Leads</h2>
            <ul className="divide-y">
              {leads.map((lead: any) => (
                <li key={lead.id} className="py-2 flex justify-between items-center">
                  <span>{lead.user?.email || "Unknown"} - {lead.intake?.id ? <Link href={`/compare/results/${lead.intake.id}`} className="text-blue-600 underline">View Quote</Link> : "No Quote"}</span>
                  <span className="text-xs text-gray-500">{new Date(lead.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Recent Quotes</h2>
            <ul className="divide-y">
              {quotes.map((quote: any) => (
                <li key={quote.id} className="py-2 flex justify-between items-center">
                  <span>{quote.user?.email || "Unknown"} - {quote.carrier?.name || "Unknown Carrier"} - ${quote.premium}</span>
                  <span className="text-xs text-gray-500">{new Date(quote.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
          <Button asChild className="w-full mt-4">
            <Link href="/admin/quotes/new">Manually Enter Comparison Quote</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
