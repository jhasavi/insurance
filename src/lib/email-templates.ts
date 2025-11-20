/**
 * Email Templates
 * 
 * HTML email templates for transactional emails
 */

interface QuoteConfirmationData {
  firstName: string
  coverageType: string
  quoteIntakeId: string
}

interface QuotesReadyData {
  firstName: string
  quoteCount: number
  bestQuote: {
    carrier: string
    annualPremium: number
  }
  savings?: number
  resultUrl: string
}

/**
 * Base email wrapper with branding
 */
const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Safora Insurance</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .highlight {
      background: #dbeafe;
      border-left: 4px solid #2563eb;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      background: #f8fafc;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
      font-size: 14px;
      color: #64748b;
    }
    .footer a {
      color: #2563eb;
      text-decoration: none;
    }
    .badge {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin-left: 8px;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
      .header {
        padding: 30px 20px;
      }
      .header h1 {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    ${content}
  </div>
</body>
</html>
`

/**
 * Quote Request Confirmation Email
 * Sent immediately after user submits quote form
 */
export function quoteConfirmationEmail(data: QuoteConfirmationData): { subject: string; html: string } {
  const coverageLabel = 
    data.coverageType === "BUNDLE" ? "Auto + Home Bundle" :
    data.coverageType === "AUTO" ? "Auto Insurance" :
    "Home Insurance"

  const content = `
    <div class="header">
      <h1>🎉 Your Quote Request is Being Processed</h1>
    </div>
    <div class="content">
      <p style="font-size: 18px; font-weight: 600; color: #1e293b;">
        Hi ${data.firstName},
      </p>
      
      <p>
        Great news! We've received your request for <strong>${coverageLabel}</strong> quotes 
        and our team is already working on finding you the best rates.
      </p>

      <div class="highlight">
        <p style="margin: 0; font-weight: 600;">
          ⏱️ What's happening now:
        </p>
        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
          <li>We're comparing rates from 15+ top-rated carriers</li>
          <li>Analyzing discounts you qualify for</li>
          <li>Preparing personalized recommendations</li>
        </ul>
      </div>

      <p style="text-align: center;">
        <a href="${process.env.NEXTAUTH_URL}/compare/results/${data.quoteIntakeId}" class="button">
          Check Status
        </a>
      </p>

      <div class="card">
        <h3 style="margin-top: 0; color: #1e293b;">📧 You'll hear from us within 24 hours</h3>
        <p style="margin: 0;">
          Most quotes are ready within <strong>5-10 minutes</strong>, but some may take up to 24 hours 
          depending on carrier availability. We'll email you as soon as your quotes are ready to view.
        </p>
      </div>

      <div class="card">
        <h3 style="margin-top: 0; color: #1e293b;">💡 Get Even Better Quotes</h3>
        <p>
          Upload your current policy for AI-powered analysis. We'll identify coverage gaps and 
          show you exactly how much you could save.
        </p>
        <p style="margin-bottom: 0;">
          <a href="${process.env.NEXTAUTH_URL}/scan" style="color: #2563eb; font-weight: 600;">
            Scan My Policy →
          </a>
        </p>
      </div>

      <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
        Questions? Just reply to this email and we'll be happy to help!
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 10px 0;">
        <strong>Safora Insurance</strong><br>
        Transparent. Simple. Better.
      </p>
      <p style="margin: 10px 0;">
        <a href="${process.env.NEXTAUTH_URL}/settings">Manage Preferences</a> • 
        <a href="${process.env.NEXTAUTH_URL}/privacy">Privacy Policy</a> • 
        <a href="${process.env.NEXTAUTH_URL}/terms">Terms of Service</a>
      </p>
      <p style="font-size: 12px; color: #94a3b8; margin: 10px 0 0 0;">
        This email was sent because you requested insurance quotes on Safora.
        You can unsubscribe at any time from your account settings.
      </p>
    </div>
  `

  return {
    subject: `Your ${coverageLabel} quotes are being prepared 🎉`,
    html: emailWrapper(content),
  }
}

/**
 * Quotes Ready Email
 * Sent when admin has entered quotes and they're ready to view
 */
export function quotesReadyEmail(data: QuotesReadyData): { subject: string; html: string } {
  const savingsText = data.savings 
    ? `You could save <strong style="color: #10b981;">$${data.savings.toLocaleString()}/year</strong> by switching!`
    : `We found you some great options!`

  const content = `
    <div class="header">
      <h1>✨ Your Insurance Quotes Are Ready!</h1>
    </div>
    <div class="content">
      <p style="font-size: 18px; font-weight: 600; color: #1e293b;">
        Hi ${data.firstName},
      </p>
      
      <p style="font-size: 16px;">
        Great news! We've finished comparing rates from top carriers and found you 
        <strong>${data.quoteCount} personalized quote${data.quoteCount > 1 ? 's' : ''}</strong>.
      </p>

      <div class="card" style="background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); border: 2px solid #2563eb;">
        <div style="text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #475569; text-transform: uppercase; letter-spacing: 1px;">
            Best Quote
          </p>
          <p style="font-size: 36px; font-weight: 700; color: #1e293b; margin: 10px 0;">
            $${data.bestQuote.annualPremium.toLocaleString()}
            <span style="font-size: 16px; color: #64748b;">/year</span>
          </p>
          <p style="margin: 0; font-size: 16px; color: #334155;">
            from <strong>${data.bestQuote.carrier}</strong>
          </p>
        </div>
      </div>

      ${data.savings ? `
        <div class="highlight">
          <p style="margin: 0; font-size: 18px; text-align: center;">
            💰 ${savingsText}
          </p>
        </div>
      ` : ''}

      <p style="text-align: center;">
        <a href="${data.resultUrl}" class="button" style="font-size: 16px;">
          View All ${data.quoteCount} Quote${data.quoteCount > 1 ? 's' : ''} →
        </a>
      </p>

      <div class="card">
        <h3 style="margin-top: 0; color: #1e293b;">📊 What's Included</h3>
        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
          <li>Side-by-side comparison of all quotes</li>
          <li>Coverage details and deductibles</li>
          <li>Discounts you qualify for</li>
          <li>Pros and cons of each carrier</li>
          <li>Our expert recommendation</li>
        </ul>
      </div>

      <div class="highlight">
        <p style="margin: 0; font-weight: 600;">
          ⏰ These quotes are valid for 30 days
        </p>
        <p style="margin: 10px 0 0 0; font-size: 14px;">
          Rates can change based on market conditions. Lock in your rate soon to secure your savings.
        </p>
      </div>

      <div class="card">
        <h3 style="margin-top: 0; color: #1e293b;">❓ Questions?</h3>
        <p style="margin: 0;">
          Our insurance experts are here to help you understand your options and choose 
          the best coverage for your needs. Just reply to this email!
        </p>
      </div>
    </div>
    <div class="footer">
      <p style="margin: 0 0 10px 0;">
        <strong>Safora Insurance</strong><br>
        Transparent. Simple. Better.
      </p>
      <p style="margin: 10px 0;">
        <a href="${process.env.NEXTAUTH_URL}/settings">Manage Preferences</a> • 
        <a href="${process.env.NEXTAUTH_URL}/privacy">Privacy Policy</a> • 
        <a href="${process.env.NEXTAUTH_URL}/terms">Terms of Service</a>
      </p>
      <p style="font-size: 12px; color: #94a3b8; margin: 10px 0 0 0;">
        This email contains your personalized insurance quotes.
        You can unsubscribe from marketing emails in your account settings.
      </p>
    </div>
  `

  return {
    subject: data.savings 
      ? `Your quotes are ready! Save $${data.savings.toLocaleString()}/year 💰`
      : `Your ${data.quoteCount} insurance quote${data.quoteCount > 1 ? 's are' : ' is'} ready! ✨`,
    html: emailWrapper(content),
  }
}

/**
 * Generic notification email
 */
export function notificationEmail(params: {
  subject: string
  heading: string
  body: string
  ctaText?: string
  ctaUrl?: string
}): { subject: string; html: string } {
  const content = `
    <div class="header">
      <h1>${params.heading}</h1>
    </div>
    <div class="content">
      ${params.body}
      ${params.ctaText && params.ctaUrl ? `
        <p style="text-align: center;">
          <a href="${params.ctaUrl}" class="button">
            ${params.ctaText}
          </a>
        </p>
      ` : ''}
    </div>
    <div class="footer">
      <p style="margin: 0 0 10px 0;">
        <strong>Safora Insurance</strong><br>
        Transparent. Simple. Better.
      </p>
      <p style="margin: 10px 0;">
        <a href="${process.env.NEXTAUTH_URL}/settings">Manage Preferences</a> • 
        <a href="${process.env.NEXTAUTH_URL}/privacy">Privacy Policy</a>
      </p>
    </div>
  `

  return {
    subject: params.subject,
    html: emailWrapper(content),
  }
}
