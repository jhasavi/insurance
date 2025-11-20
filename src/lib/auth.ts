import { PrismaAdapter } from "@auth/prisma-adapter"
import EmailProvider from "next-auth/providers/email"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const authOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM || "noreply@safora.namastebostonhomes.com",
      async sendVerificationRequest({ identifier: email, url }) {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || "Safora Insurance <noreply@safora.namastebostonhomes.com>",
            to: email,
            subject: "Sign in to Safora Insurance",
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">Safora Insurance</h1>
                  </div>
                  
                  <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #1f2937; margin-top: 0;">Sign in to your account</h2>
                    
                    <p style="color: #4b5563; margin-bottom: 30px;">
                      Click the button below to securely sign in to Safora Insurance. This link will expire in 24 hours.
                    </p>
                    
                    <div style="text-align: center; margin: 40px 0;">
                      <a href="${url}" 
                         style="background: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                        Sign In
                      </a>
                    </div>
                    
                    <div style="background: #f3f4f6; border-left: 4px solid #2563eb; padding: 15px; margin-top: 30px; border-radius: 4px;">
                      <p style="margin: 0; font-size: 14px; color: #4b5563;">
                        <strong>Security tip:</strong> If you didn't request this email, you can safely ignore it.
                      </p>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                      Or copy and paste this link into your browser:<br>
                      <a href="${url}" style="color: #2563eb; word-break: break-all;">${url}</a>
                    </p>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
                    <p>Safora Insurance - Transparent Insurance Marketplace</p>
                    <p style="margin-top: 10px;">
                      <a href="https://safora.namastebostonhomes.com/privacy" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
                      <a href="https://safora.namastebostonhomes.com/terms" style="color: #2563eb; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                    </p>
                  </div>
                </body>
              </html>
            `,
          })
        } catch (error) {
          console.error("Failed to send verification email:", error)
          throw new Error("Failed to send verification email")
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, user }: any) {
      if (session?.user) {
        session.user.id = user.id
        session.user.role = user.role
      }
      return session
    },
  },
  events: {
    async createUser({ user }: any) {
      // Log user creation in audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "USER_CREATED",
          resource: "User",
          resourceId: user.id,
          details: {
            email: user.email,
            method: "EMAIL_MAGIC_LINK",
          },
        },
      })
    },
  },
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
}
