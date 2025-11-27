import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      )
    }

    // Convert file to base64 or store it
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    return NextResponse.json({
      success: true,
      imageUrl: dataUrl,
      fileName: file.name,
      size: file.size,
    })
  } catch (error) {
    console.error("Upload API error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to upload image" },
      { status: 500 }
    )
  }
}
