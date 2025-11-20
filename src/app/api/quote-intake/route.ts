import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logAuditEvent, logConsent } from "@/lib/audit"
import { trackServerEvent } from "@/lib/analytics"
import { sendEmail } from "@/lib/email"
import { quoteConfirmationEmail } from "@/lib/email-templates"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions as any) as { user?: any }
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Extract form data
    const {
      coverageType,
      firstName,
      lastName,
      dateOfBirth,
      maritalStatus,
      vehicleYear,
      vehicleMake,
      vehicleModel,
      vehicleMileage,
      parkingLocation,
      propertyAddress,
      propertyCity,
      propertyState,
      propertyZipCode,
      propertyYearBuilt,
      propertySquareFootage,
      coverageLevel,
      currentCarrier,
      currentPremium,
      consentMarketing,
      consentReferral,
      consentDataProcessing,
    } = body

    // Validate required fields
    if (!coverageType || !firstName || !lastName || !dateOfBirth || !maritalStatus || !coverageLevel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate consent
    if (!consentDataProcessing || !consentReferral) {
      return NextResponse.json(
        { error: "Required consents not granted" },
        { status: 400 }
      )
    }

    // Get client IP for audit logging
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "unknown"

    // Update user profile if needed
    await prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        firstName,
        lastName,
      },
      update: {
        firstName,
        lastName,
      },
    })

    // Log consent
    await logConsent(session.user.id, "dataProcessing", consentDataProcessing, ip)
    await logConsent(session.user.id, "referral", consentReferral, ip)
    if (consentMarketing !== undefined) {
      await logConsent(session.user.id, "marketing", consentMarketing, ip)
    }

    // Prepare quote intake data
    const quoteData: any = {
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      maritalStatus,
      coverageLevel,
      currentCarrier: currentCarrier || null,
      currentPremium: currentPremium ? parseFloat(currentPremium) : null,
    }

    // Add vehicle data if AUTO or BUNDLE
    if (coverageType === "AUTO" || coverageType === "BUNDLE") {
      if (!vehicleYear || !vehicleMake || !vehicleModel || !vehicleMileage) {
        return NextResponse.json(
          { error: "Vehicle information required for auto insurance" },
          { status: 400 }
        )
      }
      quoteData.vehicle = {
        year: parseInt(vehicleYear),
        make: vehicleMake,
        model: vehicleModel,
        mileage: vehicleMileage,
        parkingLocation,
      }
    }

    // Add property data if HOME or BUNDLE
    if (coverageType === "HOME" || coverageType === "BUNDLE") {
      if (!propertyAddress || !propertyCity || !propertyState || !propertyZipCode || !propertyYearBuilt || !propertySquareFootage) {
        return NextResponse.json(
          { error: "Property information required for home insurance" },
          { status: 400 }
        )
      }
      quoteData.property = {
        address: propertyAddress,
        city: propertyCity,
        state: propertyState,
        zipCode: propertyZipCode,
        yearBuilt: parseInt(propertyYearBuilt),
        squareFootage: parseInt(propertySquareFootage),
      }
    }

    // Create Lead
    const lead = await prisma.lead.create({
      data: {
        userId: session.user.id,
        status: "NEW",
        source: "QUOTE_FORM",
        contactEmail: session.user.email!,
      },
    })

    // Create QuoteIntake
    const quoteIntake = await prisma.quoteIntake.create({
      data: {
        leadId: lead.id,
        line: coverageType === "HOME" ? "HOME" : "AUTO", // Default to AUTO for BUNDLE (can be enhanced)
        json: quoteData,
        completed: true,
      },
    })

    // Create Vehicle record if needed
    if (quoteData.vehicle) {
      await prisma.vehicle.create({
        data: {
          userId: session.user.id,
          make: vehicleMake,
          model: vehicleModel,
          year: parseInt(vehicleYear),
          mileage: vehicleMileage === "20000+" ? 25000 : parseInt(vehicleMileage.split("-")[0].replace(",", "")),
          parkingLocation,
          primaryUse: "PERSONAL",
        },
      })
    }

    // Create Property record if needed
    if (quoteData.property) {
      await prisma.property.create({
        data: {
          userId: session.user.id,
          type: "SINGLE_FAMILY", // Default, can be enhanced
          address: propertyAddress,
          city: propertyCity,
          state: propertyState,
          zipCode: propertyZipCode,
          yearBuilt: parseInt(propertyYearBuilt),
          squareFootage: parseInt(propertySquareFootage),
          constructionType: "WOOD_FRAME", // Default
          securityFeatures: [],
        },
      })
    }

    // Log audit event
    await logAuditEvent({
      userId: session.user.id,
      action: "QUOTE_REQUESTED",
      resource: "QuoteIntake",
      resourceId: quoteIntake.id,
      details: {
        coverageType,
        coverageLevel,
        leadId: lead.id,
      },
      ipAddress: ip,
      userAgent: request.headers.get("user-agent") || undefined,
    })

    // Track analytics event
    await trackServerEvent("compare_completed", {
      userId: session.user.id,
      coverageType,
      coverageLevel,
      hasVehicle: !!quoteData.vehicle,
      hasProperty: !!quoteData.property,
    })

    // Send confirmation email
    try {
      const emailTemplate = quoteConfirmationEmail({
        firstName: firstName || "there",
        coverageType,
        quoteIntakeId: quoteIntake.id,
      })

      await sendEmail({
        to: session.user.email!,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        userId: session.user.id,
        category: "quote",
      })
    } catch (emailError) {
      // Don't fail the request if email fails
      console.error("Failed to send confirmation email:", emailError)
    }

    return NextResponse.json({
      success: true,
      id: quoteIntake.id,
      leadId: lead.id,
      message: "Quote request submitted successfully",
    })

  } catch (error) {
    console.error("Quote intake error:", error)
    
    return NextResponse.json(
      { 
        error: "Failed to process quote request",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
