import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PlaygroundInterface } from "@/components/playground/playground-interface"

export const metadata = {
  title: "Playground - FRN AI",
  description: "Try out FRN AI models with text chat, image generation, and image editing",
}

export default function PlaygroundPage() {
  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-hidden">
        <PlaygroundInterface />
      </main>
    </div>
  )
}
