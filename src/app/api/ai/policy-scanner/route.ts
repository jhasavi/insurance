import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any

    const body = await request.json()
    const { fileUrl, fileName, fileSize } = body

    if (!fileUrl || !fileName) {
      return NextResponse.json(
        { error: 'File URL and name are required' },
        { status: 400 }
      )
    }

    // Structured mock analysis for MVP
    const analysisPayload = {
      currentCarrier: 'Progressive',
      policyType: 'AUTO',
      policyNumber: undefined as string | undefined,
      currentPremium: 1450,
      coverage: {
        bodilyInjury: '100/300',
        propertyDamage: '100',
        collision: 'Included',
        comprehensive: 'Included',
      },
      deductibles: {
        collision: 500,
        comprehensive: 500,
      },
      aiInsights: {
        benchmarkComparison: {
          competitiveRating: 'Above Avg',
        },
        confidence: {
          overall: 0.93,
          fields: {
            bodilyInjury: 0.97,
            propertyDamage: 0.95,
            collision: 0.9,
            comprehensive: 0.92,
          },
          sources: ['gpt-4-vision', 'ocr']
        }
      },
      benchmarkData: {
        marketAvgPremium: 1600,
      },
      savingsOpportunity: 550,
      recommendations: [
        'Increase liability to 250/500 to better protect assets',
        'Raise collision deductible to $1,000 to reduce premium',
      ],
      riskAreas: [
        'Low liability limit may not cover serious accidents',
      ],
      overinsuredAreas: [],
      status: 'COMPLETE' as const,
    }

    // Persist PolicyAnalysis if user is authenticated
    let created: any = null
    if (session?.user?.id) {
      created = await prisma.policyAnalysis.create({
        data: {
          userId: session.user.id,
          uploadedFileUrl: fileUrl,
          fileName,
          fileSize: typeof fileSize === 'number' ? fileSize : 0,
          extractedData: analysisPayload.coverage,
          currentCarrier: analysisPayload.currentCarrier,
          policyType: analysisPayload.policyType,
          policyNumber: analysisPayload.policyNumber || null,
          currentPremium: analysisPayload.currentPremium,
          coverage: analysisPayload.coverage as any,
          deductibles: analysisPayload.deductibles as any,
          aiInsights: analysisPayload.aiInsights as any,
          benchmarkData: analysisPayload.benchmarkData as any,
          savingsOpportunity: analysisPayload.savingsOpportunity,
          recommendations: analysisPayload.recommendations,
          riskAreas: analysisPayload.riskAreas,
          overinsuredAreas: analysisPayload.overinsuredAreas,
          status: analysisPayload.status,
        },
      })
    }

    // Return a response aligned with the Scan UI expectations
    const responseAnalysis = {
      id: created?.id || 'analysis-mock',
      currentCarrier: analysisPayload.currentCarrier,
      policyType: analysisPayload.policyType,
      currentPremium: analysisPayload.currentPremium,
      savingsOpportunity: analysisPayload.savingsOpportunity,
      recommendations: analysisPayload.recommendations,
      riskAreas: analysisPayload.riskAreas,
      aiInsights: analysisPayload.aiInsights,
      status: analysisPayload.status,
    }

    return NextResponse.json({ success: true, analysis: responseAnalysis })

  } catch (error) {
    console.error('Policy scanner error:', error)
    return NextResponse.json({ error: 'Failed to analyze policy' }, { status: 500 })
  }
}
