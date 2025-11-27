import { type NextRequest, NextResponse } from "next/server"

// Voice API endpoint for processing speech and generating responses
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, type = "gemini" } = body

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      )
    }

    let response_text = ""

    // Use Gemini API (free tier available)
    if (type === "gemini") {
      try {
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_KEY || process.env.GEMINI_API_KEY
        if (!apiKey) {
          // Fallback to public Gemini endpoint
          const res = await fetch("https://api.gemini.pro/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: text }),
          })
          const data = await res.json()
          response_text = data.text || data.response || "I couldn't process that request"
        } else {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text }] }],
              }),
            }
          )
          const data = await res.json()
          response_text =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "I couldn't generate a response"
        }
      } catch (error) {
        console.error("Gemini error:", error)
        response_text = "I encountered an error processing your request"
      }
    }

    // Fallback to OpenAI if Gemini fails
    if (!response_text && type !== "gemini") {
      try {
        const openaiKey = process.env.OPENAI_API_KEY
        if (openaiKey) {
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${openaiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [{ role: "user", content: text }],
              max_tokens: 150,
            }),
          })
          const data = await res.json()
          response_text = data.choices?.[0]?.message?.content || "No response"
        }
      } catch (error) {
        console.error("OpenAI error:", error)
      }
    }

    return NextResponse.json({
      success: true,
      response: response_text,
      type,
    })
  } catch (error) {
    console.error("Voice API error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
