import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, ImageIcon, Clock, Cpu, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

const chatModels = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "Most capable model for complex tasks. Best for nuanced understanding and creative writing.",
    features: ["128K context", "Vision capable", "Fastest reasoning"],
    speed: "Fast",
    quality: "Highest",
    badge: "Recommended",
  },
  {
    id: "gpt-3.5",
    name: "GPT-3.5 Turbo",
    description: "Fast and efficient for simpler tasks. Great for quick responses and basic conversations.",
    features: ["16K context", "Low latency", "Cost effective"],
    speed: "Very Fast",
    quality: "Good",
    badge: null,
  },
]

const imageModels = [
  {
    id: "flux",
    name: "Flux",
    description: "High-quality image generation with excellent prompt following and artistic styles.",
    styles: ["Default", "Ghibli", "Cyberpunk", "Anime", "Portrait", "3D"],
    sizes: ["1:1", "3:2", "2:3"],
    badge: "Popular",
  },
  {
    id: "deepimg",
    name: "DeepImg",
    description: "Fast image generation with good quality. Suitable for quick iterations.",
    styles: ["Default", "Artistic", "Photorealistic"],
    sizes: ["1:1", "16:9"],
    badge: null,
  },
]

export const metadata = {
  title: "Models - Anbu AI",
  description: "Explore available AI models for chat and image generation",
}

export default function ModelsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8 md:py-12 max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Available Models</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our selection of powerful AI models for text generation and image creation.
            </p>
          </div>

          {/* Chat Models */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Chat Models</h2>
                <p className="text-muted-foreground">Text generation and conversation</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {chatModels.map((model) => (
                <Card key={model.id} className="relative overflow-hidden">
                  {model.badge && <Badge className="absolute top-4 right-4">{model.badge}</Badge>}
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      {model.name}
                    </CardTitle>
                    <CardDescription>{model.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {model.features.map((feature) => (
                        <Badge key={feature} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Speed: {model.speed}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                        <span>Quality: {model.quality}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Image Models */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Image Models</h2>
                <p className="text-muted-foreground">Image generation and creation</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {imageModels.map((model) => (
                <Card key={model.id} className="relative overflow-hidden">
                  {model.badge && <Badge className="absolute top-4 right-4">{model.badge}</Badge>}
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-primary" />
                      {model.name}
                    </CardTitle>
                    <CardDescription>{model.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-2">Available Styles</p>
                        <div className="flex flex-wrap gap-2">
                          {model.styles.map((style) => (
                            <Badge key={style} variant="outline">
                              {style}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Sizes</p>
                        <div className="flex flex-wrap gap-2">
                          {model.sizes.map((size) => (
                            <Badge key={size} variant="secondary">
                              {size}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to try our models?</h2>
            <p className="text-muted-foreground mb-6">Start using our AI models now. No login required.</p>
            <Button asChild size="lg">
              <Link href="/playground">
                Open Playground
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
