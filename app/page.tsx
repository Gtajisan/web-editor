"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ModelsSection } from "@/components/models-section"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ModelsSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  )
}
