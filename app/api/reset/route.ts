import { type NextRequest, NextResponse } from "next/server"

// Note: This is a simple implementation. In production, share state with chat route
// or use a proper session store like Redis
const conversationHistory = new Map<string, Array<{ role: string; content: string }>>()

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.headers.get("x-session-id") || "default"

    const existed = conversationHistory.has(sessionId)
    conversationHistory.delete(sessionId)

    return NextResponse.json({
      status: "ok",
      message: "Conversation reset",
      sessionId,
      hadHistory: existed,
    })
  } catch (error) {
    console.error("Reset API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
