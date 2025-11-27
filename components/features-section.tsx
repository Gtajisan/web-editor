"use client"

import { Code2, Shield, Zap, Globe } from "lucide-react"
import { useI18n } from "@/lib/i18n"

const features = [
  {
    icon: Zap,
    titleKey: "unifiedProvider",
    descKey: "unifiedProviderDesc",
  },
  {
    icon: Code2,
    titleKey: "simpleRest",
    descKey: "simpleRestDesc",
  },
  {
    icon: Shield,
    titleKey: "noApiKeys",
    descKey: "noApiKeysDesc",
  },
  {
    icon: Globe,
    titleKey: "openSource",
    descKey: "openSourceDesc",
  },
]

export function FeaturesSection() {
  const { t } = useI18n()
  
  return (
    <section className="py-12 md:py-16 lg:py-24 border-t border-border/40">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="mx-auto max-w-2xl text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight sm:text-4xl">{t("featuresTitle")}</h2>
          <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground">
            {t("featuresSubtitle")}
          </p>
        </div>

        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.titleKey} className="flex flex-col items-center text-center p-4 md:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t(feature.titleKey)}</h3>
              <p className="text-sm text-muted-foreground">{t(feature.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
