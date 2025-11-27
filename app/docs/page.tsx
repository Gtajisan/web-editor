import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DocsSidebar } from "@/components/docs/docs-sidebar"
import { DocsContent } from "@/components/docs/docs-content"

export const metadata = {
  title: "Documentation - FRN AI",
  description: "API documentation for FRN AI platform - Chat, Image Generation, and Image Editing APIs",
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="container flex flex-col lg:flex-row gap-6 lg:gap-10 px-4 md:px-6 py-6 md:py-10 max-w-7xl mx-auto flex-1">
        <DocsSidebar />
        <main className="flex-1 min-w-0">
          <DocsContent />
        </main>
      </div>
      <Footer />
    </div>
  )
}
