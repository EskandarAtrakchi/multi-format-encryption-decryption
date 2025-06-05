import { type NextRequest, NextResponse } from "next/server"

const CORRECT_PIN = process.env.CORRECT_PIN || "1234" // fallback only if env not set

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json()

    if (pin === CORRECT_PIN) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, message: "Incorrect PIN" })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
