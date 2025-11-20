import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any) as { user?: any }
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const carriers = await prisma.insuranceCarrier.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    })

    return NextResponse.json({ carriers })
  } catch (error) {
    console.error("Fetch carriers error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
