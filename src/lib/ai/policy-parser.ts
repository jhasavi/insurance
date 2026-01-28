import OpenAI from 'openai'

// Check if API key is configured
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️  OPENAI_API_KEY is not configured. Policy analysis will not work.')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
})

export interface PolicyData {
  carrier: string
  policyType: 'AUTO' | 'HOME' | 'LIFE' | 'UMBRELLA' | 'RENTERS'
  policyNumber?: string
  currentPremium?: number
  effectiveDate?: string
  expirationDate?: string
  coverage: {
    [key: string]: {
      limit: string | number
      deductible?: string | number
    }
  }
  deductibles: {
    [key: string]: number
  }
  discounts?: string[]
  namedInsureds?: string[]
  vehicles?: Array<{
    year: number
    make: string
    model: string
    vin?: string
  }>
  property?: {
    address: string
    type: string
    yearBuilt?: number
  }
}

export interface PolicyInsights {
  gapAnalysis: string[]
  overpaymentAreas: string[]
  riskAreas: string[]
  recommendations: string[]
  benchmarkComparison: {
    averageMarketPremium: number
    estimatedSavings: number
    competitiveRating: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR'
  }
}

export async function analyzePolicyWithVision(
  imageUrl: string
): Promise<{ data: PolicyData; insights: PolicyInsights }> {
  // Check if API key is configured
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key-for-build') {
    throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.')
  }

  const startTime = Date.now()

  try {
    // Step 1: Extract data using GPT-4 Vision
    const extractionPrompt = `You are an expert insurance policy analyst. Analyze this insurance policy document and extract all relevant information in a structured format.

Extract the following information:
1. Insurance carrier/company name
2. Policy type (Auto, Home, Life, Umbrella, Renters)
3. Policy number
4. Premium amount (annual or monthly)
5. Effective and expiration dates
6. Coverage details (liability limits, collision, comprehensive, dwelling, personal property, etc.)
7. Deductibles for each coverage type
8. Named insureds
9. For auto: vehicle details (year, make, model, VIN)
10. For home: property address, type, year built
11. Applied discounts
12. Any special endorsements or riders

Return the data in a structured JSON format. Be thorough and accurate.`

    const extractionResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: extractionPrompt },
            {
              type: 'image_url',
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4096,
    })

    const extractedData = JSON.parse(
      extractionResponse.choices[0].message.content || '{}'
    ) as PolicyData

    // Step 2: Analyze and provide insights
    const analysisPrompt = `You are an expert insurance advisor. Based on the following policy data, provide detailed insights:

Policy Data:
${JSON.stringify(extractedData, null, 2)}

Provide:
1. **Gap Analysis**: Identify any coverage gaps or areas where the insured may be underprotected (e.g., low liability limits, missing umbrella policy, no comprehensive coverage, inadequate dwelling coverage)

2. **Overpayment Areas**: Identify where the insured might be paying too much (e.g., high premiums for low-risk profile, unnecessary coverage, better rates available)

3. **Risk Areas**: Highlight potential risks the insured should address (e.g., no flood insurance in flood zone, low medical payments coverage, insufficient replacement cost coverage)

4. **Recommendations**: Provide 5-7 specific, actionable recommendations to improve coverage or reduce costs

5. **Market Benchmark**: Estimate average market premium for similar coverage and calculate potential savings. Rate the policy as EXCELLENT, GOOD, AVERAGE, or POOR compared to market.

Consider:
- Massachusetts insurance requirements and typical rates
- Industry best practices for coverage limits
- Common discounts the insured may be missing
- Bundle opportunities (auto + home)
- Risk factors that affect premiums

Return as structured JSON with the following format:
{
  "gapAnalysis": ["list of gaps"],
  "overpaymentAreas": ["areas of potential overpayment"],
  "riskAreas": ["identified risks"],
  "recommendations": ["specific recommendations"],
  "benchmarkComparison": {
    "averageMarketPremium": number,
    "estimatedSavings": number,
    "competitiveRating": "EXCELLENT" | "GOOD" | "AVERAGE" | "POOR"
  }
}`

    const analysisResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert insurance advisor who provides unbiased, consumer-focused advice.',
        },
        {
          role: 'user',
          content: analysisPrompt,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2048,
    })

    const insights = JSON.parse(
      analysisResponse.choices[0].message.content || '{}'
    ) as PolicyInsights

    const processingTime = Date.now() - startTime

    console.log(`✅ Policy analyzed in ${processingTime}ms`)

    return {
      data: extractedData,
      insights,
    }
  } catch (error) {
    console.error('❌ Policy analysis error:', error)
    throw new Error(`Failed to analyze policy: ${error}`)
  }
}

export async function benchmarkPolicyPremium(
  policyData: PolicyData
): Promise<{
  averageMarketPremium: number
  carrierPremiums: { carrier: string; premium: number }[]
  estimatedSavings: number
}> {
  // In production, this would query actual carrier rates
  // For MVP, we'll use AI to estimate based on typical market rates

  const benchmarkPrompt = `Based on the following policy details, estimate the average market premium from major carriers in Massachusetts.

Policy Details:
${JSON.stringify(policyData, null, 2)}

Provide estimated premiums from 5 major carriers:
1. Progressive
2. GEICO
3. State Farm
4. Liberty Mutual
5. Allstate

Consider:
- Massachusetts average rates for similar coverage
- Typical discounts available
- Risk factors affecting premium

Return as JSON:
{
  "averageMarketPremium": number,
  "carrierPremiums": [
    {"carrier": "Progressive", "premium": number},
    ...
  ],
  "estimatedSavings": number (difference from current premium)
}`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are an insurance pricing expert with knowledge of Massachusetts insurance market rates.',
      },
      {
        role: 'user',
        content: benchmarkPrompt,
      },
    ],
    response_format: { type: 'json_object' },
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}
