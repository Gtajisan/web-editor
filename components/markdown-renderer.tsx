"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Check, Copy, ChevronDown, ChevronUp, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { JSX } from "react"

interface MarkdownRendererProps {
  content: string
  className?: string
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.split("\n")
  const isLong = lines.length > 15

  return (
    <div className="relative my-4 rounded-lg border border-border bg-secondary/50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-secondary/80 border-b border-border">
        <span className="text-xs font-medium text-muted-foreground">{language || "code"}</span>
        <div className="flex items-center gap-2">
          {isLong && (
            <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-7 px-2">
              {collapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2">
            {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      </div>
      <div className={cn("overflow-x-auto transition-all", collapsed && isLong ? "max-h-[100px] overflow-hidden" : "")}>
        <pre className="p-4 text-sm">
          <code className="font-mono">{code}</code>
        </pre>
      </div>
      {collapsed && isLong && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-secondary to-transparent pointer-events-none" />
      )}
    </div>
  )
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const parseContent = (text: string) => {
    const parts: JSX.Element[] = []
    let lastIndex = 0
    let key = 0

    // Match code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    let match

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(<span key={key++}>{parseInlineContent(text.slice(lastIndex, match.index))}</span>)
      }

      // Add code block
      parts.push(<CodeBlock key={key++} code={match[2].trim()} language={match[1]} />)

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(<span key={key++}>{parseInlineContent(text.slice(lastIndex))}</span>)
    }

    return parts
  }

  const parseInlineContent = (text: string) => {
    const lines = text.split("\n")
    const elements: JSX.Element[] = []
    let key = 0

    lines.forEach((line, lineIndex) => {
      // Images (must check before links)
      if (line.match(/^!\[([^\]]*)\]$$([^)]+)$$/)) {
        const imageMatch = line.match(/^!\[([^\]]*)\]$$([^)]+)$$/)
        if (imageMatch) {
          const imageUrl = imageMatch[2]
          elements.push(
            <div key={key++} className="my-4 rounded-lg overflow-hidden border border-border bg-card">
              <img src={imageUrl} alt={imageMatch[1]} className="w-full h-auto" />
              <div className="p-3 bg-secondary/30 flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={async () => {
                    try {
                      const response = await fetch(imageUrl)
                      const blob = await response.blob()
                      const url = window.URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = `anbu-ai-${Date.now()}.png`
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      window.URL.revokeObjectURL(url)
                    } catch (error) {
                      window.open(imageUrl, "_blank")
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download Image
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(imageUrl, "_blank")}
                >
                  Open Full Size
                </Button>
              </div>
            </div>,
          )
        }
      }
      // Headers
      else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={key++} className="text-lg font-semibold mt-4 mb-2">
            {parseInlineStyles(line.slice(4))}
          </h3>,
        )
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={key++} className="text-xl font-bold mt-6 mb-3">
            {parseInlineStyles(line.slice(3))}
          </h2>,
        )
      } else if (line.startsWith("# ")) {
        elements.push(
          <h1 key={key++} className="text-2xl font-bold mt-6 mb-4">
            {parseInlineStyles(line.slice(2))}
          </h1>,
        )
      }
      // Bullet points
      else if (line.match(/^[-*•]\s/)) {
        elements.push(
          <li key={key++} className="ml-4 list-disc">
            {parseInlineStyles(line.slice(2))}
          </li>,
        )
      }
      // Numbered lists
      else if (line.match(/^\d+\.\s/)) {
        const content = line.replace(/^\d+\.\s/, "")
        elements.push(
          <li key={key++} className="ml-4 list-decimal">
            {parseInlineStyles(content)}
          </li>,
        )
      }
      // Blockquotes
      else if (line.startsWith("> ")) {
        elements.push(
          <blockquote key={key++} className="border-l-4 border-primary pl-4 italic text-muted-foreground my-2">
            {parseInlineStyles(line.slice(2))}
          </blockquote>,
        )
      }
      // Regular paragraph
      else if (line.trim()) {
        elements.push(
          <p key={key++} className="my-1">
            {parseInlineStyles(line)}
          </p>,
        )
      }
      // Empty line
      else {
        elements.push(<br key={key++} />)
      }
    })

    return elements
  }

  const parseInlineStyles = (text: string): (string | JSX.Element)[] => {
    const result: (string | JSX.Element)[] = []
    let remaining = text
    let key = 0

    // Process inline code, bold, italic
    while (remaining.length > 0) {
      // Inline code
      const codeMatch = remaining.match(/`([^`]+)`/)
      // Bold
      const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)
      // Italic
      const italicMatch = remaining.match(/\*([^*]+)\*/)
      // Links
      const linkMatch = remaining.match(/\[([^\]]+)\]$$([^)]+)$$/)

      const matches = [
        { match: codeMatch, type: "code" },
        { match: boldMatch, type: "bold" },
        { match: italicMatch, type: "italic" },
        { match: linkMatch, type: "link" },
      ].filter((m) => m.match !== null)

      if (matches.length === 0) {
        result.push(remaining)
        break
      }

      // Find earliest match
      const earliest = matches.reduce((a, b) => (a.match!.index! < b.match!.index! ? a : b))

      const match = earliest.match!
      const before = remaining.slice(0, match.index)

      if (before) result.push(before)

      if (earliest.type === "code") {
        result.push(
          <code key={key++} className="bg-secondary px-1.5 py-0.5 rounded text-sm font-mono text-primary">
            {match[1]}
          </code>,
        )
      } else if (earliest.type === "bold") {
        result.push(<strong key={key++}>{match[1]}</strong>)
      } else if (earliest.type === "italic") {
        result.push(<em key={key++}>{match[1]}</em>)
      } else if (earliest.type === "link") {
        // Don't render "Download Image" links as we have a button instead
        if (match[1] !== "Download Image") {
          result.push(
            <a
              key={key++}
              href={match[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:no-underline"
            >
              {match[1]}
            </a>,
          )
        }
      }

      remaining = remaining.slice(match.index! + match[0].length)
    }

    return result
  }

  return <div className={cn("prose prose-invert max-w-none", className)}>{parseContent(content)}</div>
}
