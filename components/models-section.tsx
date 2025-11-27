"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ImageIcon, Sparkles, Zap } from "lucide-react"
import { useI18n } from "@/lib/i18n"

const models = [
  {
    name: "GPT-4o",
    description: "Most capable model for complex tasks with advanced reasoning and analysis capabilities.",
    icon: Sparkles,
    badgeKey: "recommended",
    features: ["Text and vision", "Advanced reasoning", "2048 max tokens"],
  },
  {
    name: "GPT-3.5",
    description: "Fast and efficient model for everyday tasks with great cost-effectiveness.",
    icon: MessageSquare,
    badgeKey: "fast",
    features: ["Text generation", "Quick responses", "Conversation history"],
  },
  {
    name: "DeepImg",
    description: "High-quality image generation with multiple artistic styles and aspect ratios.",
    icon: ImageIcon,
    badgeKey: "images",
    features: ["Multiple styles", "Custom sizes", "PNG output"],
  },
  {
    name: "Flux",
    description: "Fast image generation using state-of-the-art diffusion models.",
    icon: Zap,
    badgeKey: "new",
    features: ["Quick generation", "High quality", "Custom dimensions"],
  },
]

export function ModelsSection() {
  const { t } = useI18n()
  
  return (
    <section className="py-12 md:py-16 lg:py-24 border-t border-border/40" id="models">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="mx-auto max-w-2xl text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight sm:text-4xl">{t("modelsTitle")}</h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground">
            {t("modelsSubtitle")}
          </p>
        </div>

        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {models.map((model) => (
            <Card key={model.name} className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <model.icon className="h-8 w-8 text-primary" />
                  <Badge variant="secondary" className="text-xs">{t(model.badgeKey)}</Badge>
                </div>
                <CardTitle>{model.name}</CardTitle>
                <CardDescription>{model.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {model.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
