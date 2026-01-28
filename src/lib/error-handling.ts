import { NextRequest, NextResponse } from "next/server"
import { captureException } from "@sentry/nextjs"

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = "APIError"
  }
}

export class ValidationError extends APIError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR")
    this.name = "ValidationError"
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "AUTHENTICATION_ERROR")
    this.name = "AuthenticationError"
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = "Access denied") {
    super(message, 403, "AUTHORIZATION_ERROR")
    this.name = "AuthorizationError"
  }
}

export class NotFoundError extends APIError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND_ERROR")
    this.name = "NotFoundError"
  }
}

export function handleAPIError(error: unknown): NextResponse {
  console.error("API Error:", error)

  // Log to Sentry if available
  if (process.env.NODE_ENV === "production") {
    captureException(error)
  }

  if (error instanceof APIError) {
    return NextResponse.json(
      { 
        error: error.message,
        code: error.code,
        statusCode: error.statusCode
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    // Don't expose internal error details in production
    const message = process.env.NODE_ENV === "production" 
      ? "Internal server error" 
      : error.message

    return NextResponse.json(
      { 
        error: message,
        code: "INTERNAL_ERROR"
      },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { 
      error: "Unknown error occurred",
      code: "UNKNOWN_ERROR"
    },
    { status: 500 }
  )
}

export function withErrorHandling(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request)
    } catch (error) {
      return handleAPIError(error)
    }
  }
}

export async function requireAuth(
  request: NextRequest,
  requiredRole?: string
): Promise<{ userId: string; email: string; role?: string }> {
  const { getServerSession } = await import("next-auth/next")
  const { authOptions } = await import("@/lib/auth")
  
  const session = await getServerSession(authOptions as any) as { user?: { id: string; email: string } }
  
  if (!session?.user?.id) {
    throw new AuthenticationError()
  }

  if (requiredRole) {
    const { prisma } = await import("@/lib/prisma")
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || user.role !== requiredRole) {
      throw new AuthorizationError()
    }

    return {
      userId: session.user.id,
      email: session.user.email,
      role: user.role
    }
  }

  return {
    userId: session.user.id,
    email: session.user.email
  }
}
