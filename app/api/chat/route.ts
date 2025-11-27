import { type NextRequest, NextResponse } from "next/server"

// In-memory conversation storage (use Redis/database in production)
const conversationHistory = new Map<string, Array<{ role: string; content: string }>>()

async function callGpt4o(options: {
  messages: Array<{ role: string; content: string }>
  systemInstruction?: string
  temperature?: number
  max_tokens?: number
}) {
  const payload = {
    messages: [
      {
        role: "system",
        content: (options.systemInstruction || "") + ", you are a helpful assistant.",
      },
      ...options.messages.filter((msg) => msg.role !== "system"),
    ],
    temperature: options.temperature || 0.9,
    top_p: 0.7,
    top_k: 40,
    max_tokens: options.max_tokens || 512,
  }

  const response = await fetch("https://api.deepenglish.com/api/gpt_open_ai/chatnew", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer UFkOfJaclj61OxoD7MnQknU1S2XwNdXMuSZA+EZGLkc=",
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!data.success) {
    throw new Error("Failed to get response")
  }

  return { success: true, answer: data.message }
}

async function callGpt35(messages: Array<{ role: string; content: string }>, systemPrompt: string) {
  const payload = {
    messages: [{ role: "system", content: systemPrompt }, ...messages.filter((msg) => msg.role !== "system")],
    temperature: 0.9,
    max_tokens: 512,
  }

  const response = await fetch("https://api.deepenglish.com/api/gpt_open_ai/chatnew", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer UFkOfJaclj61OxoD7MnQknU1S2XwNdXMuSZA+EZGLkc=",
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!data.success) {
    throw new Error("Failed to get response")
  }

  return { success: true, answer: data.message }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, model, systemPrompt } = body
    const sessionId = request.headers.get("x-session-id") || "default"
    const selectedModel = model || "default"

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Get or create conversation history
    if (!conversationHistory.has(sessionId)) {
      conversationHistory.set(sessionId, [])
    }
    const history = conversationHistory.get(sessionId)!

    // Add user message to history
    history.push({ role: "user", content: message })

    // Build messages array
    let messages = [...history]
    if (systemPrompt) {
      messages = [{ role: "system", content: systemPrompt }, ...messages]
    }

    // Call the appropriate model
    let response
    if (selectedModel === "gpt-3.5") {
      response = await callGpt35(messages, systemPrompt || "Be a helpful assistant")
    } else {
      response = await callGpt4o({
        messages,
        systemInstruction: systemPrompt,
        temperature: 0.9,
        max_tokens: 2048,
      })
    }

    if (!response || !response.success) {
      return NextResponse.json({ error: "Failed to get response from " + selectedModel }, { status: 500 })
    }

    // Add assistant response to history
    history.push({ role: "assistant", content: response.answer })

    // Limit history size
    if (history.length > 20) {
      history.splice(0, history.length - 20)
    }

    return NextResponse.json({
      text: response.answer,
      model: selectedModel,
      citations: [],
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
