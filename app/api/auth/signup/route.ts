import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()
    console.log('Received signup request for:', email)

    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields')
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    try {
      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        console.log('User already exists:', email)
        return NextResponse.json(
          { message: "User with this email already exists" },
          { status: 400 }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      const user = await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      })

      console.log('User created successfully:', email)

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user

      return NextResponse.json(
        {
          message: "User created successfully",
          user: userWithoutPassword,
        },
        { status: 201 }
      )
    } catch (error) {
      console.error('Database operation failed:', error)
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle known Prisma errors
        if (error.code === 'P2002') {
          return NextResponse.json(
            { message: "This email is already registered" },
            { status: 400 }
          )
        }
      }

      return NextResponse.json(
        { 
          message: "Database error occurred",
          error: error instanceof Error ? error.message : "Unknown database error"
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error in signup route:", error)
    return NextResponse.json(
      { 
        message: "Something went wrong",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
} 