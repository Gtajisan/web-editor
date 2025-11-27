import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Users, Globe, Heart, Code, Lightbulb, Shield } from "lucide-react"

const values = [
  {
    icon: Code,
    title: "Open Source",
    description: "We believe in transparency and community-driven development.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data is yours. We don't store or sell your conversations.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Built by developers, for developers. Join our growing community.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Constantly improving and adding new AI capabilities.",
  },
]

const stats = [
  { value: "1M+", label: "API Requests" },
  { value: "50K+", label: "Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "5+", label: "AI Models" },
]

export const metadata = {
  title: "About - Anbu AI",
  description: "Learn about Anbu AI and our mission",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-8 md:py-12 max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4">About Us</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Making AI Accessible to Everyone</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Anbu AI is an open-source platform that democratizes access to powerful AI models. No login required,
              completely free.
            </p>
          </div>

          {/* Mission */}
          <section className="mb-16">
            <div className="max-w-3xl mx-auto text-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe that AI should be accessible to everyone, regardless of technical expertise or financial
                resources. Our mission is to provide free, open-source AI tools that empower creators, developers, and
                businesses to build amazing things without barriers.
              </p>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="pt-6 text-center">
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Values */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Our Values</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <Card key={value.title}>
                  <CardContent className="pt-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Team */}
          <section className="text-center">
            <div className="max-w-2xl mx-auto">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Built with Love</h2>
              <p className="text-muted-foreground mb-6">
                Anbu AI is built and maintained by AnbuSoft, a team passionate about making AI accessible to everyone.
                We&apos;re always looking for contributors and feedback.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">Based in Bangladesh</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
