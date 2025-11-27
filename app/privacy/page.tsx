import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"

export const metadata = {
  title: "Privacy Policy - Anbu AI",
  description: "Privacy policy for Anbu AI platform",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-12 max-w-3xl">
          <Badge className="mb-4">Legal</Badge>
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">Last updated: January 2025</p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground">
                Anbu AI is designed with privacy in mind. We collect minimal data necessary to provide our services:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Chat messages are processed but not permanently stored on our servers</li>
                <li>Generated images are temporarily cached for delivery</li>
                <li>Basic usage analytics (page views, feature usage)</li>
                <li>Session data stored locally in your browser</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Data</h2>
              <p className="text-muted-foreground">Your data is used solely to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Process your requests and generate responses</li>
                <li>Improve our AI models and services</li>
                <li>Maintain and optimize platform performance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Data Storage</h2>
              <p className="text-muted-foreground">
                Chat history and generated images are stored locally in your browser using localStorage. This data never
                leaves your device unless you explicitly share it. You can clear this data at any time from the
                playground interface.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
              <p className="text-muted-foreground">
                We use third-party AI providers to power our models. Your prompts are sent to these services for
                processing but are not stored by them beyond the immediate request.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
              <p className="text-muted-foreground">You have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Access your locally stored data</li>
                <li>Delete your data at any time</li>
                <li>Use our services without creating an account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
              <p className="text-muted-foreground">For privacy-related questions, contact us at privacy@anbusoft.com</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
