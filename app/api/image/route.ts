import { type NextRequest, NextResponse } from "next/server"

const sizeMap: Record<string, string> = {
  "1:1": "1024x1024",
  "3:2": "1080x720",
  "2:3": "720x1080",
}

const styleMap: Record<string, string> = {
  default: "-style Realism",
  ghibli: "-style Ghibli Art",
  cyberpunk: "-style Cyberpunk",
  anime: "-style Anime",
  portrait: "-style Portrait",
  "3d": "-style 3D",
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, style = "default", size = "1:1" } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Generate device ID (32 hex chars)
    const deviceId = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("")

    const response = await fetch("https://api-preview.apirouter.ai/api/v1/deepimg/flux-1-dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: "https://deepimg.ai",
        referer: "https://deepimg.ai/",
      },
      body: JSON.stringify({
        device_id: deviceId,
        prompt: `${prompt} ${styleMap[style] || ""}`,
        size: sizeMap[size] || "1024x1024",
        n: "1",
        output_format: "png",
      }),
    })

    const data = await response.json()

    if (!data.data?.images?.[0]?.url) {
      return NextResponse.json({ success: false, error: "Failed to generate image" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      model: "deepimg",
      imageUrl: data.data.images[0].url,
      prompt: prompt.substring(0, 100),
    })
  } catch (error) {
    console.error("Image API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
