import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PlaygroundInterface } from "@/components/playground/playground-interface"

export const metadata = {
  title: "Playground - Anbu AI",
  description: "Try out Anbu AI models in the interactive playground",
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
