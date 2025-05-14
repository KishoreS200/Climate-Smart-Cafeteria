import { verifyToken } from "@/lib/jwt"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Define the JWT payload type
interface JWTPayload {
  userId: string
  email: string
  name: string
  iat?: number
  exp?: number
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const decoded = verifyToken(token) as JWTPayload
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    return NextResponse.json({
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name,
    })
  } catch (error) {
    console.error("Auth check failed:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
} 