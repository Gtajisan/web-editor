"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Copy, Check } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function HeroSection() {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("npm i anbuai")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }
  
  return (
    <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="container relative px-4 md:px-6 max-w-7xl mx-auto">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-balance">
            {t("heroTitle")} <span className="text-primary"></span>
          </h1>

          <p className="mx-auto mt-4 md:mt-6 max-w-2xl text-base text-muted-foreground md:text-lg lg:text-xl">
            {t("heroSubtitle")}
          </p>

          <div className="mt-6 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <Button asChild size="lg" className="gap-2 w-full sm:w-auto">
              <Link href="/playground">
                {t("startBuilding")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent w-full sm:w-auto">
              <Link href="/docs">{t("viewDocumentation")}</Link>
            </Button>
          </div>

          <div className="mt-8 md:mt-12 flex items-center justify-center px-4">
            <div className="flex items-center gap-2 md:gap-3 rounded-lg border border-border/50 bg-muted/50 backdrop-blur-sm px-3 md:px-4 py-2 font-mono text-xs md:text-sm overflow-x-auto max-w-full hover:bg-muted/70 transition-all duration-300">
              <code className="whitespace-nowrap">
                <span className="text-muted-foreground/70 select-none">$</span>{" "}
                <span className="text-foreground font-semibold">npm i anbuai</span>
              </code>
              <button 
                onClick={handleCopy}
                className="text-muted-foreground hover:text-foreground transition-colors ml-1"
                aria-label="Copy command"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
