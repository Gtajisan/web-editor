import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { I18nProvider } from "@/lib/i18n"
import { Toaster } from "@/components/ui/toaster"
import { TelegramPopup } from "@/components/telegram-popup"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FRN AI - Modern AI Interface Platform",
  description:
    "Modern, multilingual AI interface platform powered by Next.js 16, featuring advanced chat capabilities and image generation. No login required, completely free.",
  keywords: ["AI", "Chat", "Image Generation", "Multilingual", "Next.js", "AI Platform", "Text Generation"],
  authors: [{ name: "Gtajisan" }],
  openGraph: {
    title: "FRN AI - Modern AI Interface Platform",
    description: "Modern, multilingual AI interface platform powered by Next.js 16, featuring advanced chat capabilities and image generation.",
    type: "website",
  },
    generator: 'frn-ai.com'
}

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <I18nProvider>
          {children}
          <TelegramPopup />
          <Toaster />
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
