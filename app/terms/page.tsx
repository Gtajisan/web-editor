import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Terms of Service - Anbu AI",
  description: "Terms of service for Anbu AI platform",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-12 max-w-3xl">
          <Badge className="mb-4">Legal</Badge>
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">Last updated: January 2025</p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using Anbu AI, you accept and agree to be bound by these Terms of Service. If you do
                not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground">
                Anbu AI provides AI-powered text generation and image creation services through an open API platform.
                Our services are provided &quot;as is&quot; without warranties of any kind.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Acceptable Use</h2>
              <p className="text-muted-foreground">You agree not to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Use our services for illegal purposes</li>
                <li>Generate harmful, abusive, or offensive content</li>
                <li>Attempt to circumvent rate limits or abuse the API</li>
                <li>Impersonate others or spread misinformation</li>
                <li>Use our services to generate NSFW or explicit content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
              <p className="text-muted-foreground">
                Content you generate using our services belongs to you. However, you grant us a license to use
                anonymized data for improving our services. Our platform code, design, and branding remain our
                intellectual property.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Anbu AI and its operators shall not be liable for any indirect, incidental, special, consequential, or
                punitive damages resulting from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Continued use of our services after changes
                constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Contact</h2>
              <p className="text-muted-foreground">For questions about these terms, contact us at legal@anbusoft.com</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
