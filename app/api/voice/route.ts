import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text } = body

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 })
    }

    let response_text = ""

    // Try HuggingFace free inference (Mistral model)
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inputs: text,
            parameters: { max_new_tokens: 300, temperature: 0.7 },
          }),
        }
      )

      if (response.ok) {
        const data = await response.json()
        response_text = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text
      }
    } catch (error) {
      console.log("HF Voice fallback...")
    }

    // Groq API fallback
    if (!response_text) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: text }],
            model: "mixtral-8x7b-32768",
            max_tokens: 300,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          response_text = data.choices?.[0]?.message?.content
        }
      } catch (error) {
        console.log("Groq Voice fallback...")
      }
    }

    // Simple fallback
    if (!response_text) {
      response_text = `I heard: "${text}". This is a demo response. The AI service is temporarily unavailable.`
    }

    return NextResponse.json({
      success: true,
      response: response_text,
      type: "free-api",
    })
  } catch (error) {
    console.error("Voice API error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
