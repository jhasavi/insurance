import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { analyzePolicyWithVision } from '@/lib/ai/policy-parser'

export async function POST(request: NextRequest) {
  try {
    // For MVP, skip authentication - accept anonymous uploads
    // TODO: Add authentication in Phase 2
    
    const body = await request.json()
    const { fileUrl, fileName, fileSize, userEmail } = body

    if (!fileUrl || !fileName) {
      return NextResponse.json(
        { error: 'File URL and name are required' },
        { status: 400 }
      )
    }

    // Try to find or create anonymous user
    let user
    if (userEmail) {
      user = await prisma.user.findUnique({
        where: { email: userEmail },
      })
    }
    
    // Create anonymous user if not found
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: `anonymous-${Date.now()}@temp.com`,
          role: 'CLIENT',
        },
      })
    }

    // Create initial PolicyAnalysis record
    const analysis = await prisma.policyAnalysis.create({
      data: {
        userId: user.id,
        uploadedFileUrl: fileUrl,
        fileName,
        fileSize: fileSize || 0,
        policyType: 'AUTO', // Default to AUTO, will be detected by AI
        status: 'ANALYZING',
        extractedData: {},
        coverage: {},
        deductibles: {},
        aiInsights: {},
        benchmarkData: {},
      },
    })

    // Analyze policy in background (in production, use a queue)
    try {
      const startTime = Date.now()

      const { data, insights } = await analyzePolicyWithVision(
        fileUrl,
        fileName
      )

      const processingTime = Date.now() - startTime

      // Update analysis with results
      const updatedAnalysis = await prisma.policyAnalysis.update({
        where: { id: analysis.id },
        data: {
          status: 'COMPLETE',
          extractedData: data as any,
          currentCarrier: data.carrier,
          policyType: data.policyType,
          currentPremium: data.currentPremium,
          coverage: data.coverage as any,
          deductibles: data.deductibles as any,
          aiInsights: insights as any,
          benchmarkData: insights.benchmarkComparison as any,
          savingsOpportunity:
            insights.benchmarkComparison.estimatedSavings || 0,
          recommendations: insights.recommendations,
          riskAreas: insights.riskAreas,
          overinsuredAreas: insights.overpaymentAreas,
          processingTimeMs: processingTime,
        },
      })

      return NextResponse.json({
        success: true,
        analysis: updatedAnalysis,
        message: 'Policy analyzed successfully',
      })
    } catch (analysisError) {
      console.error('Analysis error:', analysisError)

      // Update with error status
      await prisma.policyAnalysis.update({
        where: { id: analysis.id },
        data: {
          status: 'FAILED',
          errorMessage:
            analysisError instanceof Error
              ? analysisError.message
              : 'Unknown error',
        },
      })

      return NextResponse.json(
        {
          error: 'Failed to analyze policy',
          details: analysisError instanceof Error ? analysisError.message : '',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Policy scanner error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : '',
      },
      { status: 500 }
    )
  }
}

// Get analysis by ID
export async function GET(request: NextRequest) {
  try {
    // For MVP, allow anonymous access
    const { searchParams } = new URL(request.url)
    const analysisId = searchParams.get('id')
    const userEmail = searchParams.get('email')

    if (analysisId) {
      // Get specific analysis
      const analysis = await prisma.policyAnalysis.findFirst({
        where: {
          id: analysisId,
        },
      })

      if (!analysis) {
        return NextResponse.json(
          { error: 'Analysis not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ analysis })
    } else if (userEmail) {
      // Get analyses for user email
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
      })

      if (!user) {
        return NextResponse.json({ analyses: [] })
      }

      const analyses = await prisma.policyAnalysis.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json({ analyses })
    } else {
      return NextResponse.json(
        { error: 'Analysis ID or email required' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Get analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
