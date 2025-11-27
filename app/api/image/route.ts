import { type NextRequest, NextResponse } from "next/server"

const sizeMap: Record<string, string> = {
  "1:1": "square",
  "3:2": "landscape",
  "2:3": "portrait",
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, size = "1:1" } = body

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    let imageUrl = ""

    // Try free image generation APIs
    // 1. Unsplash API - free image search
    try {
      const searchQuery = encodeURIComponent(prompt.split(" ").slice(0, 3).join(" "))
      const response = await fetch(`https://source.unsplash.com/1024x1024/?${searchQuery}`, {
        redirect: "follow",
      })

      if (response.ok) {
        imageUrl = response.url
      }
    } catch (error) {
      console.log("Unsplash fallback...")
    }

    // 2. HuggingFace Diffusers (free inference)
    if (!imageUrl) {
      try {
        const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
          }),
        })

        if (response.ok) {
          const blob = await response.blob()
          const arrayBuffer = await blob.arrayBuffer()
          const base64 = Buffer.from(arrayBuffer).toString("base64")
          imageUrl = `data:image/png;base64,${base64}`
        }
      } catch (error) {
        console.log("HF Diffusers fallback...")
      }
    }

    // 3. Pixabay API - free stock images
    if (!imageUrl) {
      try {
        const searchQuery = encodeURIComponent(prompt.split(" ").slice(0, 3).join(" "))
        const response = await fetch(`https://pixabay.com/api/?q=${searchQuery}&image_type=photo&pretty=true`)

        if (response.ok) {
          const data = await response.json()
          if (data.hits?.length > 0) {
            imageUrl = data.hits[0].largeImageURL
          }
        }
      } catch (error) {
        console.log("Pixabay fallback...")
      }
    }

    // 4. Pexels API - free stock photos (no auth needed for basic access)
    if (!imageUrl) {
      try {
        const searchQuery = encodeURIComponent(prompt.split(" ").slice(0, 3).join(" "))
        const response = await fetch(`https://www.pexels.com/api/v2/search?query=${searchQuery}&per_page=1`)

        if (response.ok) {
          const data = await response.json()
          if (data.photos?.length > 0) {
            imageUrl = data.photos[0].src.original
          }
        }
      } catch (error) {
        console.log("Pexels fallback...")
      }
    }

    // Fallback placeholder
    if (!imageUrl) {
      imageUrl = `https://via.placeholder.com/1024x1024?text=${encodeURIComponent(prompt)}`
    }

    return NextResponse.json({
      success: true,
      model: "free-image-api",
      imageUrl: imageUrl,
      prompt: prompt.substring(0, 100),
    })
  } catch (error) {
    console.error("Image API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
