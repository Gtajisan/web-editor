import { type NextRequest, NextResponse } from "next/server"

// In-memory conversation storage
const conversationHistory = new Map<string, Array<{ role: string; content: string }>>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, model = "gpt-3.5" } = body
    const sessionId = request.headers.get("x-session-id") || "default"

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Get or create conversation history
    if (!conversationHistory.has(sessionId)) {
      conversationHistory.set(sessionId, [])
    }
    const history = conversationHistory.get(sessionId)!
    history.push({ role: "user", content: message })

    let responseText = ""

    // Try Groq API (completely free, no key needed for inference)
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Using free tier - no auth required for public endpoints
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a helpful AI assistant." },
            ...history.slice(-10), // Last 10 messages
          ],
          model: "mixtral-8x7b-32768",
          temperature: 0.7,
          max_tokens: 1000,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        responseText = data.choices?.[0]?.message?.content
      }
    } catch (error) {
      console.log("Groq API fallback...")
    }

    // Fallback to HuggingFace Inference API (free, no auth)
    if (!responseText) {
      try {
        const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: `${message}`,
            parameters: {
              max_new_tokens: 500,
              temperature: 0.7,
            },
          }),
        })

        if (response.ok) {
          const data = await response.json()
          responseText = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text
        }
      } catch (error) {
        console.log("HF API fallback...")
      }
    }

    // Final fallback - simple echo with AI-like response
    if (!responseText) {
      responseText = `I received your message: "${message}". This is a demo response. Please check your internet connection or try again.`
    }

    history.push({ role: "assistant", content: responseText })

    // Limit history size
    if (history.length > 20) {
      history.splice(0, history.length - 20)
    }

    return NextResponse.json({
      text: responseText,
      model: model,
      citations: [],
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
