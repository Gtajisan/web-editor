"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { User, Bot, Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useI18n } from "@/lib/i18n"

interface ChatMessageProps {
  id?: string
  role: "user" | "assistant"
  content: string
  onEdit?: (id: string, content: string) => void
  onDelete?: (id: string) => void
  onRegenerate?: () => void
}

export function ChatMessage({ id, role, content, onEdit, onDelete, onRegenerate }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState<boolean | null>(null)
  const { toast } = useToast()
  const { t } = useI18n()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    toast({
      description: t("messageCopied"),
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEdit = () => {
    if (id && onEdit) {
      const newContent = prompt("Edit message:", content)
      if (newContent && newContent !== content) {
        onEdit(id, newContent)
      }
    }
  }

  const handleDelete = () => {
    if (id && onDelete) {
      onDelete(id)
    }
  }

  return (
    <div
      className={cn(
        "group flex gap-3 md:gap-4 py-4 px-3 md:px-4 rounded-xl transition-all duration-200",
        role === "assistant" 
          ? "bg-gradient-to-r from-secondary/50 to-secondary/30 hover:from-secondary/60 hover:to-secondary/40 border border-secondary" 
          : "hover:bg-secondary/20",
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm",
          role === "assistant" 
            ? "bg-gradient-to-br from-primary to-primary/80 shadow-primary/20" 
            : "bg-gradient-to-br from-secondary to-secondary/80",
        )}
      >
        {role === "assistant" ? (
          <Bot className="h-4 w-4 text-primary-foreground" />
        ) : (
          <User className="h-4 w-4 text-secondary-foreground" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="font-semibold text-sm flex items-center gap-2">
          {role === "assistant" ? "Anbu AI" : "You"}
          {role === "assistant" && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">AI</Badge>
          )}
        </div>

        {role === "assistant" ? (
          <MarkdownRenderer content={content} className="text-sm" />
        ) : (
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        )}

        {/* Action buttons */}
        <div className={cn("flex flex-wrap items-center gap-1 pt-2 transition-all duration-200", "opacity-0 group-hover:opacity-100")}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="ml-1 text-xs">{t("copy")}</span>
          </Button>

          {role === "assistant" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLiked(true)}
                className={cn(
                  "h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all",
                  liked === true && "text-green-500 bg-green-500/10",
                )}
              >
                <ThumbsUp className={cn("h-3.5 w-3.5", liked === true && "fill-green-500")} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLiked(false)}
                className={cn(
                  "h-7 px-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all",
                  liked === false && "text-red-500 bg-red-500/10",
                )}
              >
                <ThumbsDown className={cn("h-3.5 w-3.5", liked === false && "fill-red-500")} />
              </Button>
              {onRegenerate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRegenerate}
                  className="h-7 px-2 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="ml-1 text-xs">{t("regenerate")}</span>
                </Button>
              )}
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={handleEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                {t("edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
