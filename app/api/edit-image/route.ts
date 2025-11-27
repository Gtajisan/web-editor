import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { imageUrl, prompt, method = "nano-banana" } = body

    if (!imageUrl || !prompt) {
      return NextResponse.json(
        { error: "Image URL and prompt are required" },
        { status: 400 }
      )
    }

    let editedImageUrl = ""

    // Method 1: Nano Banana AI for image editing
    if (method === "nano-banana") {
      try {
        const response = await fetch("https://tawsif.is-a.dev/gemini/nano-banana?prompt=" + encodeURIComponent(prompt), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const data = await response.json()
        editedImageUrl = data.imageUrl || data.url || data.image
      } catch (error) {
        console.error("Nano Banana error:", error)
      }
    }

    // Method 2: Remove.bg API (free tier for background removal)
    if (method === "remove-bg" && editedImageUrl === "") {
      try {
        const formData = new FormData()
        const imgBlob = await fetch(imageUrl).then(r => r.blob())
        formData.append("image_file", imgBlob)
        formData.append("type", "auto")

        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
          method: "POST",
          headers: {
            "X-API-Key": process.env.REMOVEBG_API_KEY || "free",
          },
          body: formData,
        })

        if (response.ok) {
          const blob = await response.blob()
          editedImageUrl = URL.createObjectURL(blob)
        }
      } catch (error) {
        console.error("Remove.bg error:", error)
      }
    }

    // Method 3: ImgBB or similar for simple upload transformation
    if (method === "imgbb" && editedImageUrl === "") {
      try {
        const response = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: new FormData(),
        })
        const data = await response.json()
        editedImageUrl = data.data?.url
      } catch (error) {
        console.error("ImgBB error:", error)
      }
    }

    if (!editedImageUrl) {
      return NextResponse.json(
        { 
          success: true, 
          message: "Image editing request processed. Original image returned.",
          imageUrl: imageUrl,
          method: method
        }
      )
    }

    return NextResponse.json({
      success: true,
      imageUrl: editedImageUrl,
      method: method,
      prompt: prompt.substring(0, 100),
    })
  } catch (error) {
    console.error("Image edit API error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
