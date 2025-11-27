import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VoiceAssistant } from "@/components/voice-assistant"

export const metadata = {
  title: "Voice Assistant - FRN AI",
  description: "AI-powered voice assistant with speech recognition and text-to-speech capabilities",
}

export default function VoiceAssistantPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Voice Assistant</h1>
            <p className="text-lg text-muted-foreground">
              Interact with AI using your voice. Speak or type to get intelligent responses powered by Gemini.
            </p>
          </div>
          <VoiceAssistant />
        </div>
      </main>
      <Footer />
    </div>
  )
}
