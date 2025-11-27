export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

export type ChatSession = {
  id: string
  title: string
  messages: Message[]
  model: string
  createdAt: number
  updatedAt: number
}

export type GeneratedImage = {
  id: string
  prompt: string
  style: string
  size: string
  url: string
  createdAt: number
}

const CHAT_STORAGE_KEY = "anbu-chat-sessions"
const IMAGE_STORAGE_KEY = "anbu-generated-images"
const CURRENT_SESSION_KEY = "anbu-current-session"

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}

export function getChatSessions(): ChatSession[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(CHAT_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveChatSessions(sessions: ChatSession[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions))
}

export function getCurrentSessionId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(CURRENT_SESSION_KEY)
}

export function setCurrentSessionId(id: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CURRENT_SESSION_KEY, id)
}

export function createNewSession(model = "gpt-4o"): ChatSession {
  const session: ChatSession = {
    id: generateId(),
    title: "New Chat",
    messages: [],
    model,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  const sessions = getChatSessions()
  sessions.unshift(session)
  saveChatSessions(sessions)
  setCurrentSessionId(session.id)
  return session
}

export function getSession(id: string): ChatSession | undefined {
  const sessions = getChatSessions()
  return sessions.find((s) => s.id === id)
}

export function updateSession(session: ChatSession): void {
  const sessions = getChatSessions()
  const index = sessions.findIndex((s) => s.id === session.id)
  if (index !== -1) {
    sessions[index] = { ...session, updatedAt: Date.now() }
    saveChatSessions(sessions)
  }
}

export function deleteSession(id: string): void {
  const sessions = getChatSessions()
  const filtered = sessions.filter((s) => s.id !== id)
  saveChatSessions(filtered)
}

export function addMessageToSession(sessionId: string, message: Omit<Message, "id" | "timestamp">): Message {
  const sessions = getChatSessions()
  const session = sessions.find((s) => s.id === sessionId)
  if (!session) throw new Error("Session not found")

  const newMessage: Message = {
    ...message,
    id: generateId(),
    timestamp: Date.now(),
  }

  session.messages.push(newMessage)

  // Update title from first user message
  if (session.messages.length === 1 && message.role === "user") {
    session.title = message.content.slice(0, 50) + (message.content.length > 50 ? "..." : "")
  }

  session.updatedAt = Date.now()
  saveChatSessions(sessions)

  return newMessage
}

export function getGeneratedImages(): GeneratedImage[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(IMAGE_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveGeneratedImage(image: Omit<GeneratedImage, "id" | "createdAt">): GeneratedImage {
  const images = getGeneratedImages()
  const newImage: GeneratedImage = {
    ...image,
    id: generateId(),
    createdAt: Date.now(),
  }
  images.unshift(newImage)
  // Keep only last 50 images
  if (images.length > 50) images.pop()
  localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images))
  return newImage
}

export function deleteGeneratedImage(id: string): void {
  const images = getGeneratedImages()
  const filtered = images.filter((i) => i.id !== id)
  localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(filtered))
}

export function clearAllHistory(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CHAT_STORAGE_KEY)
  localStorage.removeItem(IMAGE_STORAGE_KEY)
  localStorage.removeItem(CURRENT_SESSION_KEY)
}
