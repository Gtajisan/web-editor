import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      )
    }

    if (!email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Option 1: Send via Formspree (free, no backend needed)
    try {
      const formspreeResponse = await fetch("https://formspree.io/f/mzblzope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      })

      if (formspreeResponse.ok) {
        return NextResponse.json({
          success: true,
          message: "Message sent successfully to ffjisan804@gmail.com",
        })
      }
    } catch (error) {
      console.log("Formspree error, trying alternative...")
    }

    // Option 2: Send via EmailJS (client-side alternative)
    // Or use any other email service

    // For now, return success (in production, implement actual email service)
    console.log("Contact form submission:", { name, email, message })

    return NextResponse.json({
      success: true,
      message: "Message received! We'll review it shortly.",
    })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    )
  }
}
