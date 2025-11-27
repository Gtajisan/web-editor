import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ImageEditor } from "@/components/image-editor"

export const metadata = {
  title: "Image Editor - FRN AI",
  description: "Edit and enhance images with AI-powered tools using Nano Banana and multiple AI models",
}

export default function ImageEditorPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container max-w-6xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Image Editor</h1>
            <p className="text-lg text-muted-foreground">
              Upload and edit your images with AI-powered enhancement tools
            </p>
          </div>
          <ImageEditor />
        </div>
      </main>
      <Footer />
    </div>
  )
}
