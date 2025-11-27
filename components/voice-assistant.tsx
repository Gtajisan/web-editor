"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Mic, Send, Volume2, Loader2, Square } from "lucide-react"
import { toast } from "sonner"

export function VoiceAssistant() {
  const [text, setText] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<any>(null)

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || (window as any).webkitSpeechRecognition)
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onstart = () => setListening(true)
      recognitionRef.current.onend = () => setListening(false)
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            setText((prev) => prev + " " + transcript)
          } else {
            interimTranscript += transcript
          }
        }
        if (interimTranscript) {
          setText((prev) => prev.split(" ").slice(0, -1).join(" ") + " " + interimTranscript)
        }
      }
      recognitionRef.current.onerror = (event: any) => {
        toast.error("Speech recognition error: " + event.error)
        setListening(false)
      }
    }

    // Initialize speech synthesis
    synthesisRef.current = window.speechSynthesis
  }, [])

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const speak = (text: string) => {
    if (!synthesisRef.current) return

    synthesisRef.current.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    synthesisRef.current.speak(utterance)
  }

  const handleSendMessage = async () => {
    if (!text.trim()) {
      toast.error("Please enter a message or use voice input")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), type: "gemini" }),
      })

      const data = await res.json()
      if (data.success) {
        setResponse(data.response)
        speak(data.response)
        setText("")
        toast.success("Response generated")
      } else {
        toast.error(data.error || "Failed to process request")
      }
    } catch (error) {
      toast.error("Error communicating with voice assistant")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel()
      setSpeaking(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Voice Assistant</CardTitle>
          <CardDescription>
            Speak or type to interact with AI-powered voice assistant powered by Gemini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Your Message</label>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message or use the mic button to speak..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-24"
                />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={listening ? stopListening : startListening}
                variant={listening ? "destructive" : "default"}
                className="gap-2"
                disabled={loading}
              >
                {listening ? (
                  <>
                    <Square className="h-4 w-4" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Start Listening
                  </>
                )}
              </Button>

              <Button
                onClick={handleSendMessage}
                disabled={loading || !text.trim()}
                className="gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Response Section */}
          {response && (
            <div className="space-y-3 bg-secondary/50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">AI Response:</h3>
                <Button
                  onClick={speaking ? stopSpeaking : () => speak(response)}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {speaking ? (
                    <>
                      <Square className="h-3 w-3" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3 w-3" />
                      Speak
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{response}</p>
            </div>
          )}

          {/* Info */}
          <div className="text-xs text-muted-foreground bg-secondary/30 p-3 rounded">
            <p>
              💡 <strong>Tip:</strong> Click "Start Listening" to use voice input, or type your message. The AI will
              respond with both text and voice.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
