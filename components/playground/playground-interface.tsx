"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, ImageIcon, MessageSquare, Download, Share2, RefreshCw, Sparkles, Zap } from "lucide-react"
import { ChatMessage } from "@/components/playground/chat-message"
import { ChatSidebar } from "@/components/playground/chat-sidebar"
import { ImageGallery } from "@/components/playground/image-gallery"
import { useToast } from "@/components/ui/use-toast"
import { useI18n } from "@/lib/i18n"
import {
  type ChatSession,
  type GeneratedImage,
  getChatSessions,
  createNewSession,
  getSession,
  updateSession,
  deleteSession,
  addMessageToSession,
  getCurrentSessionId,
  setCurrentSessionId,
  getGeneratedImages,
  saveGeneratedImage,
  deleteGeneratedImage,
  clearAllHistory,
} from "@/lib/chat-store"

export function PlaygroundInterface() {
  const [activeTab, setActiveTab] = useState("chat")
  const [chatModel, setChatModel] = useState("gpt-4o")
  const [imageStyle, setImageStyle] = useState("default")
  const [imageSize, setImageSize] = useState("1:1")

  const [chatInput, setChatInput] = useState("")
  const [imagePrompt, setImagePrompt] = useState("")

  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [currentImage, setCurrentImage] = useState<string | null>(null)

  const [chatLoading, setChatLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { t } = useI18n()

  // Initialize sessions from localStorage
  useEffect(() => {
    const storedSessions = getChatSessions()
    setSessions(storedSessions)

    const currentId = getCurrentSessionId()
    if (currentId) {
      const session = getSession(currentId)
      if (session) {
        setCurrentSession(session)
      } else if (storedSessions.length > 0) {
        setCurrentSession(storedSessions[0])
        setCurrentSessionId(storedSessions[0].id)
      }
    } else if (storedSessions.length > 0) {
      setCurrentSession(storedSessions[0])
      setCurrentSessionId(storedSessions[0].id)
    }

    setGeneratedImages(getGeneratedImages())
  }, [])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentSession?.messages])

  const handleNewChat = () => {
    const newSession = createNewSession(chatModel)
    setSessions((prev) => [newSession, ...prev])
    setCurrentSession(newSession)
  }

  const handleSelectSession = (id: string) => {
    const session = getSession(id)
    if (session) {
      setCurrentSession(session)
      setCurrentSessionId(id)
      setChatModel(session.model)
    }
  }

  const handleDeleteSession = (id: string) => {
    deleteSession(id)
    setSessions((prev) => prev.filter((s) => s.id !== id))
    if (currentSession?.id === id) {
      const remaining = sessions.filter((s) => s.id !== id)
      if (remaining.length > 0) {
        setCurrentSession(remaining[0])
        setCurrentSessionId(remaining[0].id)
      } else {
        setCurrentSession(null)
      }
    }
    toast({ description: "Chat deleted" })
  }

  const handleClearHistory = () => {
    clearAllHistory()
    setSessions([])
    setCurrentSession(null)
    setGeneratedImages([])
    toast({ description: t("sessionReset") })
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return

    let session = currentSession
    if (!session) {
      session = createNewSession(chatModel)
      setSessions((prev) => [session!, ...prev])
      setCurrentSession(session)
    }

    const userMessage = chatInput.trim()
    setChatInput("")

    // Add user message
    const newUserMessage = addMessageToSession(session.id, {
      role: "user",
      content: userMessage,
    })

    // Update local state
    setCurrentSession((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        messages: [...prev.messages, newUserMessage],
        title:
          prev.messages.length === 0 ? userMessage.slice(0, 50) + (userMessage.length > 50 ? "..." : "") : prev.title,
      }
    })
    setSessions(getChatSessions())

    setChatLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": session.id,
        },
        body: JSON.stringify({
          message: userMessage,
          model: chatModel,
        }),
      })

      const data = await response.json()

      const assistantContent = data.text || "Sorry, I couldn't generate a response."
      const newAssistantMessage = addMessageToSession(session.id, {
        role: "assistant",
        content: assistantContent,
      })

      setCurrentSession((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          messages: [...prev.messages, newAssistantMessage],
        }
      })
      setSessions(getChatSessions())
    } catch (error) {
      const errorMessage = addMessageToSession(session.id, {
        role: "assistant",
        content: "Error: Failed to connect to the API.",
      })
      setCurrentSession((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          messages: [...prev.messages, errorMessage],
        }
      })
      toast({
        variant: "destructive",
        description: t("errorOccurred"),
      })
    } finally {
      setChatLoading(false)
    }
  }

  const handleRegenerate = async () => {
    if (!currentSession || currentSession.messages.length < 2) return

    const lastUserMessage = [...currentSession.messages].reverse().find((m) => m.role === "user")
    if (!lastUserMessage) return

    // Remove last assistant message
    const updatedMessages = currentSession.messages.slice(0, -1)
    const updatedSession = { ...currentSession, messages: updatedMessages }
    updateSession(updatedSession)
    setCurrentSession(updatedSession)

    setChatInput(lastUserMessage.content)
    setTimeout(() => {
      sendChatMessage()
    }, 100)
  }

  const generateImage = async () => {
    if (!imagePrompt.trim() || imageLoading) return

    setImageLoading(true)
    setCurrentImage(null)

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imagePrompt,
          style: imageStyle,
          size: imageSize,
        }),
      })

      const data = await response.json()

      if (data.success && data.imageUrl) {
        setCurrentImage(data.imageUrl)
        const savedImage = saveGeneratedImage({
          prompt: imagePrompt,
          style: imageStyle,
          size: imageSize,
          url: data.imageUrl,
        })
        setGeneratedImages((prev) => [savedImage, ...prev])
        toast({ description: "Image generated successfully!" })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: t("errorOccurred"),
      })
    } finally {
      setImageLoading(false)
    }
  }

  const handleDownloadImage = async () => {
    if (!currentImage) return
    try {
      const response = await fetch(currentImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `anbu-ai-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast({ description: t("imageDownloaded") })
    } catch (error) {
      window.open(currentImage, "_blank")
    }
  }

  const handleDeleteImage = (id: string) => {
    deleteGeneratedImage(id)
    setGeneratedImages((prev) => prev.filter((img) => img.id !== id))
    toast({ description: "Image deleted" })
  }

  return (
    <div className="h-full flex flex-col md:flex-row">
      {/* Chat Sidebar */}
      {activeTab === "chat" && (
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSession?.id || null}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
          onClearHistory={handleClearHistory}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b border-border bg-card/50 backdrop-blur-sm px-4 py-3">
            <TabsList className="bg-secondary/50">
              <TabsTrigger value="chat" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <MessageSquare className="h-4 w-4" />
                {t("chat")}
              </TabsTrigger>
              <TabsTrigger value="image" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <ImageIcon className="h-4 w-4" />
                {t("imageGeneration")}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Chat Tab */}
          <TabsContent value="chat" className="flex-1 flex flex-col m-0 p-0 overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Model selector */}
              <div className="px-4 py-3 border-b border-border bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <Select value={chatModel} onValueChange={setChatModel}>
                    <SelectTrigger className="w-36 h-9 border-border hover:border-primary/50 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-3 w-3 text-primary" />
                          <span>GPT-4o</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="gpt-3.5">
                        <div className="flex items-center gap-2">
                          <Zap className="h-3 w-3 text-blue-500" />
                          <span>GPT-3.5</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto px-2 md:px-4 bg-gradient-to-b from-transparent via-transparent to-primary/5">
                {!currentSession || currentSession.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20 animate-pulse">
                        <Zap className="h-10 w-10 text-primary" />
                      </div>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {t("welcomeTitle")}
                    </h2>
                    <p className="text-muted-foreground max-w-md text-sm md:text-base">
                      {t("welcomeDesc")}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2 justify-center">
                      <Badge variant="outline" className="text-xs">💬 Chat</Badge>
                      <Badge variant="outline" className="text-xs">🎨 Create</Badge>
                      <Badge variant="outline" className="text-xs">🚀 Explore</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 space-y-2">
                    {currentSession.messages.map((message, index) => (
                      <ChatMessage
                        key={message.id}
                        id={message.id}
                        role={message.role}
                        content={message.content}
                        onRegenerate={
                          index === currentSession.messages.length - 1 && message.role === "assistant"
                            ? handleRegenerate
                            : undefined
                        }
                      />
                    ))}
                    {chatLoading && (
                      <div className="flex items-center gap-3 py-4 px-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                          <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                        </div>
                        <div className="flex items-center gap-1">
                          <span
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <span
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <span
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input area */}
              <div className="p-3 md:p-4 border-t border-border bg-gradient-to-t from-background/95 to-background/80 backdrop-blur-sm">
                <div className="relative max-w-3xl mx-auto">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/5 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <Textarea
                      placeholder={t("typeMessage")}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          sendChatMessage()
                        }
                      }}
                      className="min-h-[60px] max-h-[120px] pr-12 resize-none border-border focus:border-primary/50 bg-background/50 backdrop-blur-sm transition-all"
                    />
                    <Button
                      size="icon"
                      onClick={sendChatMessage}
                      disabled={chatLoading || !chatInput.trim()}
                      className="absolute right-2 bottom-2 shadow-lg hover:shadow-xl transition-all"
                    >
                      {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Image Tab */}
          <TabsContent value="image" className="flex-1 m-0 p-3 md:p-6 overflow-auto bg-gradient-to-br from-background via-background to-primary/5">
            <div className="grid gap-6 lg:grid-cols-2 max-w-6xl mx-auto">
              {/* Generator */}
              <Card className="border-border hover:border-primary/30 transition-all shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <ImageIcon className="h-4 w-4 text-primary" />
                    </div>
                    {t("imageGeneration")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                      <Sparkles className="h-3 w-3 text-primary" />
                      {t("prompt")}
                    </label>
                    <Textarea
                      placeholder={t("imagePromptPlaceholder")}
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      className="min-h-[100px] border-border focus:border-primary/50 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">{t("style")}</label>
                      <Select value={imageStyle} onValueChange={setImageStyle}>
                        <SelectTrigger className="border-border hover:border-primary/50 transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">\ud83c\udfa8 Default</SelectItem>
                          <SelectItem value="ghibli">\ud83c\udf43 Ghibli</SelectItem>
                          <SelectItem value="cyberpunk">\ud83e\udd16 Cyberpunk</SelectItem>
                          <SelectItem value="anime">\u2728 Anime</SelectItem>
                          <SelectItem value="portrait">\ud83d\udc64 Portrait</SelectItem>
                          <SelectItem value="3d">\ud83d\udcf8 3D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">{t("size")}</label>
                      <Select value={imageSize} onValueChange={setImageSize}>
                        <SelectTrigger className="border-border hover:border-primary/50 transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1:1">\u25a0 Square (1:1)</SelectItem>
                          <SelectItem value="3:2">\u25ad Landscape (3:2)</SelectItem>
                          <SelectItem value="2:3">\u25ae Portrait (2:3)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={generateImage} 
                    disabled={imageLoading || !imagePrompt.trim()} 
                    className="w-full h-11 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    {imageLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t("generating")}
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        {t("generate")}
                      </>
                    )}
                  </Button>

                  {/* Current generated image */}
                  {currentImage && (
                    <div className="relative rounded-xl overflow-hidden border-2 border-primary/20 shadow-xl">
                      <img src={currentImage || "/placeholder.svg"} alt="Generated" className="w-full h-auto" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-sm flex items-center justify-center gap-2">
                        <Button size="sm" variant="secondary" onClick={handleDownloadImage} className="shadow-lg">
                          <Download className="h-4 w-4 mr-1" />
                          {t("download")}
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            navigator.clipboard.writeText(currentImage)
                            toast({ description: "Image URL copied" })
                          }}
                          className="shadow-lg"
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          {t("share")}
                        </Button>
                        <Button size="sm" variant="secondary" onClick={generateImage} className="shadow-lg">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          {t("regenerate")}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Gallery */}
              <Card className="border-border hover:border-primary/30 transition-all shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <ImageIcon className="h-4 w-4 text-primary" />
                    </div>
                    {t("gallery")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ImageGallery images={generatedImages} onDelete={handleDeleteImage} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
