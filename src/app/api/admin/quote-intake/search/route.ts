import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any) as { user?: any }
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // TODO: Check if user is admin when role is available
    // if (session.user.role !== "ADMIN") {
    //   return NextResponse.json(
    //     { message: "Forbidden" },
    //     { status: 403 }
    //   )
    // }

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json(
        { message: "Search query required" },
        { status: 400 }
      )
    }

    // Search by quote intake ID first
    let quoteIntake = await prisma.quoteIntake.findUnique({
      where: { id: query },
      include: {
        lead: {
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    })

    // If not found by ID, search by email
    if (!quoteIntake) {
      quoteIntake = await prisma.quoteIntake.findFirst({
        where: {
          lead: {
            user: {
              email: query.toLowerCase(),
            },
          },
        },
        orderBy: { createdAt: "desc" },
        include: {
          lead: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
      })
    }

    if (!quoteIntake) {
      return NextResponse.json(
        { message: "Quote intake not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ quoteIntake })
  } catch (error) {
    console.error("Quote intake search error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
