"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Upload, Wand2, Loader2, Download } from "lucide-react"
import { toast } from "sonner"

export function ImageEditor() {
  const [image, setImage] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [editedImage, setEditedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [method, setMethod] = useState("nano-banana")

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        setImage(data.imageUrl)
        toast.success("Image uploaded successfully")
      }
    } catch (error) {
      toast.error("Failed to upload image")
      console.error(error)
    }
  }

  const handleEditImage = async () => {
    if (!image || !prompt) {
      toast.error("Please upload an image and enter a prompt")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/edit-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: image,
          prompt,
          method,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setEditedImage(data.imageUrl)
        toast.success("Image edited successfully")
      } else {
        toast.error(data.error || "Failed to edit image")
      }
    } catch (error) {
      toast.error("Error editing image")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const downloadImage = (imageUrl: string) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `edited-image-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Image Editor</CardTitle>
          <CardDescription>Upload and edit images with AI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-secondary/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">Click to upload or drag and drop</span>
                <span className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</span>
              </label>
            </div>

            {/* Preview */}
            {image && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Original Image:</p>
                <div className="relative w-full bg-secondary/20 rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt="Original"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Editor Options */}
          {image && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Editing Method</label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nano-banana">Nano Banana AI</SelectItem>
                    <SelectItem value="remove-bg">Remove Background</SelectItem>
                    <SelectItem value="imgbb">ImgBB Transform</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Edit Prompt</label>
                <Textarea
                  placeholder="Describe how you want to edit the image... (e.g., 'Make it black and white', 'Brighten the image')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-24"
                />
              </div>

              <Button
                onClick={handleEditImage}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Edit Image
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Edited Image Preview */}
          {editedImage && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Edited Image:</p>
              <div className="relative w-full bg-secondary/20 rounded-lg overflow-hidden">
                <img
                  src={editedImage}
                  alt="Edited"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
              <Button
                onClick={() => downloadImage(editedImage)}
                variant="outline"
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Edited Image
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
