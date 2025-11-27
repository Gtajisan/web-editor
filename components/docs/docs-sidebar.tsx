"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useState } from "react"

const sections = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "#introduction" },
      { title: "Quick Start", href: "#quickstart" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { title: "Chat Completions", href: "#chat" },
      { title: "Image Generation", href: "#images" },
      { title: "Session Management", href: "#sessions" },
      { title: "Status", href: "#status" },
    ],
  },
  {
    title: "Models",
    items: [
      { title: "GPT-4o", href: "#gpt4o" },
      { title: "GPT-3.5", href: "#gpt35" },
      { title: "DeepImg", href: "#deepimg" },
    ],
  },
]

export function DocsSidebar() {
  const [activeSection, setActiveSection] = useState("#introduction")

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <nav className="sticky top-24 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <h4 className="font-semibold mb-2 text-sm">{section.title}</h4>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setActiveSection(item.href)}
                    className={cn(
                      "block text-sm py-1 px-2 rounded transition-colors",
                      activeSection === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
