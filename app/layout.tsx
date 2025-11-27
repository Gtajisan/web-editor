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
  title: "Anbu AI - Open AI Platform",
  description:
    "Open-source AI platform for text generation and image creation. Access GPT-4o, GPT-3.5, and image generation APIs. No login required.",
  keywords: ["AI", "API", "GPT", "Image Generation", "Open Source", "Chatbot", "Text Generation"],
  authors: [{ name: "Anbu Soft" }],
  openGraph: {
    title: "Anbu AI - Open AI Platform",
    description: "Open-source AI platform for text generation and image creation.",
    type: "website",
  },
    generator: 'anbuinfosec.live'
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
