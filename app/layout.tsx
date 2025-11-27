import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ESP32 RF Jammer Control Platform',
  description: 'Advanced 2.4GHz wireless jammer control interface by Gtajisan',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-50">{children}</body>
    </html>
  )
}
