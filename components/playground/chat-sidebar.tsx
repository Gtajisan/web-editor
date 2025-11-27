"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, MessageSquare, Trash2, MoreHorizontal, PanelLeftClose, PanelLeft } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useI18n } from "@/lib/i18n"
import type { ChatSession } from "@/lib/chat-store"

interface ChatSidebarProps {
  sessions: ChatSession[]
  currentSessionId: string | null
  onNewChat: () => void
  onSelectSession: (id: string) => void
  onDeleteSession: (id: string) => void
  onClearHistory: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onClearHistory,
  collapsed,
  onToggleCollapse,
}: ChatSidebarProps) {
  const { t } = useI18n()

  // Group sessions by date
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const lastWeek = new Date(today)
  lastWeek.setDate(lastWeek.getDate() - 7)

  const groupedSessions = {
    today: sessions.filter((s) => new Date(s.updatedAt) >= today),
    yesterday: sessions.filter((s) => new Date(s.updatedAt) >= yesterday && new Date(s.updatedAt) < today),
    lastWeek: sessions.filter((s) => new Date(s.updatedAt) >= lastWeek && new Date(s.updatedAt) < yesterday),
    older: sessions.filter((s) => new Date(s.updatedAt) < lastWeek),
  }

  if (collapsed) {
    return (
      <div className="hidden md:flex w-12 border-r border-border bg-card flex-col items-center py-4">
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="mb-4">
          <PanelLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onNewChat}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="hidden md:flex w-64 border-r border-border bg-card flex-col">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <Button onClick={onNewChat} variant="outline" className="flex-1 justify-start gap-2 bg-transparent">
          <Plus className="h-4 w-4" />
          {t("newChat")}
        </Button>
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="ml-2">
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-2">
        {Object.entries(groupedSessions).map(([group, items]) => {
          if (items.length === 0) return null
          return (
            <div key={group} className="mb-4">
              <div className="px-2 py-1 text-xs text-muted-foreground font-medium">
                {group === "today" && "Today"}
                {group === "yesterday" && "Yesterday"}
                {group === "lastWeek" && "Last 7 days"}
                {group === "older" && "Older"}
              </div>
              {items.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors",
                    currentSessionId === session.id ? "bg-secondary" : "hover:bg-secondary/50",
                  )}
                  onClick={() => onSelectSession(session.id)}
                >
                  <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate text-sm">{session.title}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteSession(session.id)
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )
        })}
      </ScrollArea>

      {sessions.length > 0 && (
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            {t("clearHistory")}
          </Button>
        </div>
      )}
    </div>
  )
}
