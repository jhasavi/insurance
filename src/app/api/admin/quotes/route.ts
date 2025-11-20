import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logAuditEvent } from "@/lib/audit"
import { sendEmail } from "@/lib/email"
import { quotesReadyEmail } from "@/lib/email-templates"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any) as { user?: any }
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // TODO: Check if user is admin
    // if (session.user.role !== "ADMIN") {
    //   return NextResponse.json(
    //     { message: "Forbidden" },
    //     { status: 403 }
    //   )
    // }

    const body = await request.json()
    const {
      quoteIntakeId,
      leadId,
      carrierId,
      annualPremium,
      monthlyPremium,
      deductibles,
      pros,
      cons,
      affiliateLink,
      commissionAmount,
    } = body

    if (!quoteIntakeId || !leadId || !carrierId || !annualPremium) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get the lead to get userId
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    })

    if (!lead) {
      return NextResponse.json(
        { message: "Lead not found" },
        { status: 404 }
      )
    }

    // Get quote intake to determine quote type
    const quoteIntake = await prisma.quoteIntake.findUnique({
      where: { id: quoteIntakeId },
    })

    if (!quoteIntake) {
      return NextResponse.json(
        { message: "Quote intake not found" },
        { status: 404 }
      )
    }

    const formData = quoteIntake.json as any
    const quoteType = formData.coverageType || "AUTO"
    
    // Calculate expiration date (30 days from now)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    // Create the comparison quote
    const quote = await prisma.comparisonQuote.create({
      data: {
        userId: lead.userId!,
        carrierId,
        quoteType,
        premium: annualPremium,
        monthlyPremium: monthlyPremium || annualPremium / 12,
        coverage: {},
        deductibles: deductibles ? { description: deductibles } : {},
        discounts: {},
        pros: pros ? pros.split("\n").filter(Boolean) : [],
        cons: cons ? cons.split("\n").filter(Boolean) : [],
        affiliateLink: affiliateLink || undefined,
        referralFee: commissionAmount || undefined,
        isManual: true,
        expiresAt,
      },
      include: {
        carrier: true,
      },
    })

    // Get all quotes for this user to determine if we should send email
    const allQuotes = await prisma.comparisonQuote.findMany({
      where: { userId: lead.userId! },
      include: {
        carrier: true,
      },
      orderBy: { premium: "asc" },
    })

    const currentPremium = formData?.currentPremium
    const savings = currentPremium
      ? Math.max(0, parseFloat(currentPremium) - allQuotes[0].premium)
      : undefined

    // Send "Quotes Ready" email
    let emailSent = false
    try {
      const emailTemplate = quotesReadyEmail({
        firstName: lead.user?.profile?.firstName || "there",
        quoteCount: allQuotes.length,
        bestQuote: {
          carrier: allQuotes[0].carrier.name,
          annualPremium: allQuotes[0].premium,
        },
        savings,
        resultUrl: `${process.env.NEXTAUTH_URL}/compare/results/${quoteIntakeId}`,
      })

      await sendEmail({
        to: lead.user?.email || "",
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        userId: lead.userId!,
        category: "quote",
      })

      emailSent = true
    } catch (emailError) {
      console.error("Failed to send quotes ready email:", emailError)
    }

    // Log audit event
    await logAuditEvent({
      userId: session.user.id,
      action: "USER_CREATED",
      resource: "ComparisonQuote",
      details: {
        quoteId: quote.id,
        leadId,
        carrierId,
        annualPremium,
        isManual: true,
        adminId: session.user.id,
        actionType: "QUOTE_CREATED",
      },
    })

    return NextResponse.json({
      success: true,
      quote,
      emailSent,
    })
  } catch (error) {
    console.error("Create quote error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
