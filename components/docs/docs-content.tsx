import { CodeBlock } from "@/components/docs/code-block"
import { Badge } from "@/components/ui/badge"

export function DocsContent() {
  return (
    <div className="prose prose-invert max-w-none">
      <section id="introduction" className="mb-16">
        <h1 className="text-4xl font-bold mb-4">Anbu AI Documentation</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Anbu AI is an open-source platform for building AI applications. Access powerful language models and image
          generation APIs with simple REST endpoints.
        </p>
        <div className="flex gap-2 mb-8">
          <Badge>No API Key Required</Badge>
          <Badge variant="secondary">Open Source</Badge>
        </div>
      </section>

      <section id="quickstart" className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
        <p className="text-muted-foreground mb-4">Get started with a simple API call. No authentication required.</p>

        <CodeBlock
          title="Chat Completion Request"
          language="bash"
          code={`curl -X POST /api/chat \\
  -H "Content-Type: application/json" \\
  -H "X-Session-Id: my-session" \\
  -d '{
    "message": "Hello, how are you?",
    "model": "gpt-4o"
  }'`}
        />

        <CodeBlock
          title="Response"
          language="json"
          code={`{
  "text": "Hello! I'm doing well, thank you for asking. How can I assist you today?",
  "model": "gpt-4o",
  "citations": []
}`}
        />
      </section>

      <section id="chat" className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Chat Completions</h2>
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">POST</Badge>
          <code className="text-sm bg-secondary px-2 py-1 rounded">/api/chat</code>
        </div>

        <p className="text-muted-foreground mb-6">
          Generate text completions using various AI models. Supports conversation history via session management.
        </p>

        <h3 className="text-lg font-semibold mb-3">Request Headers</h3>
        <div className="rounded-lg border border-border overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Header</th>
                <th className="text-left py-3 px-4 font-medium">Required</th>
                <th className="text-left py-3 px-4 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4 font-mono text-primary">Content-Type</td>
                <td className="py-3 px-4">Yes</td>
                <td className="py-3 px-4 text-muted-foreground">application/json</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primary">X-Session-Id</td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4 text-muted-foreground">Unique session identifier for conversation history</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold mb-3">Request Body</h3>
        <div className="rounded-lg border border-border overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Parameter</th>
                <th className="text-left py-3 px-4 font-medium">Type</th>
                <th className="text-left py-3 px-4 font-medium">Required</th>
                <th className="text-left py-3 px-4 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4 font-mono text-primary">message</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">Yes</td>
                <td className="py-3 px-4 text-muted-foreground">The user message to send</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primary">model</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4 text-muted-foreground">Model to use: gpt-4o, gpt-3.5 (default: gpt-4o)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primary">systemPrompt</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4 text-muted-foreground">Custom system instructions for the model</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock
          title="Example Request"
          language="javascript"
          code={`const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Session-Id': 'user-123'
  },
  body: JSON.stringify({
    message: 'Explain quantum computing in simple terms',
    model: 'gpt-4o',
    systemPrompt: 'You are a helpful science tutor'
  })
});

const data = await response.json();
console.log(data.text);`}
        />
      </section>

      <section id="images" className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Image Generation</h2>
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">POST</Badge>
          <code className="text-sm bg-secondary px-2 py-1 rounded">/api/image</code>
        </div>

        <p className="text-muted-foreground mb-6">Generate images using AI models with various styles and sizes.</p>

        <h3 className="text-lg font-semibold mb-3">Request Body</h3>
        <div className="rounded-lg border border-border overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Parameter</th>
                <th className="text-left py-3 px-4 font-medium">Type</th>
                <th className="text-left py-3 px-4 font-medium">Required</th>
                <th className="text-left py-3 px-4 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4 font-mono text-primary">prompt</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">Yes</td>
                <td className="py-3 px-4 text-muted-foreground">Description of the image to generate</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primary">style</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4 text-muted-foreground">
                  Style: default, ghibli, cyberpunk, anime, portrait, 3d
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primary">size</td>
                <td className="py-3 px-4">string</td>
                <td className="py-3 px-4">No</td>
                <td className="py-3 px-4 text-muted-foreground">Aspect ratio: 1:1, 3:2, 2:3 (default: 1:1)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock
          title="Example Request"
          language="javascript"
          code={`const response = await fetch('/api/image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'A futuristic city at sunset with flying cars',
    style: 'cyberpunk',
    size: '1:1'
  })
});

const data = await response.json();
console.log(data.imageUrl);`}
        />

        <CodeBlock
          title="Response"
          language="json"
          code={`{
  "success": true,
  "model": "deepimg",
  "imageUrl": "https://example.com/generated-image.png",
  "prompt": "A futuristic city at sunset with flying cars"
}`}
        />
      </section>

      <section id="sessions" className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Session Management</h2>
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">POST</Badge>
          <code className="text-sm bg-secondary px-2 py-1 rounded">/api/reset</code>
        </div>

        <p className="text-muted-foreground mb-6">Reset conversation history for a specific session.</p>

        <CodeBlock
          title="Reset Conversation"
          language="bash"
          code={`curl -X POST /api/reset \\
  -H "X-Session-Id: my-session"`}
        />

        <CodeBlock
          title="Response"
          language="json"
          code={`{
  "status": "ok",
  "message": "Conversation reset",
  "sessionId": "my-session",
  "hadHistory": true
}`}
        />
      </section>

      <section id="status" className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Status</h2>
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">GET</Badge>
          <code className="text-sm bg-secondary px-2 py-1 rounded">/api/status</code>
        </div>

        <p className="text-muted-foreground mb-6">Check the API status and available models.</p>

        <CodeBlock
          title="Response"
          language="json"
          code={`{
  "status": "ok",
  "version": "1.0.0",
  "models": ["gpt-4o", "gpt-3.5", "deepimg"]
}`}
        />
      </section>

      <section id="gpt4o" className="mb-16">
        <h2 className="text-2xl font-bold mb-4">GPT-4o Model</h2>
        <p className="text-muted-foreground mb-4">
          GPT-4o is the most capable model available, offering advanced reasoning, longer context, and vision
          capabilities.
        </p>

        <h3 className="text-lg font-semibold mb-3">Parameters</h3>
        <div className="rounded-lg border border-border overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left py-3 px-4 font-medium">Parameter</th>
                <th className="text-left py-3 px-4 font-medium">Default</th>
                <th className="text-left py-3 px-4 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4 font-mono text-primary">temperature</td>
                <td className="py-3 px-4">0.9</td>
                <td className="py-3 px-4 text-muted-foreground">Controls randomness (0-1)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primary">max_tokens</td>
                <td className="py-3 px-4">2048</td>
                <td className="py-3 px-4 text-muted-foreground">Maximum response length</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-primary">top_p</td>
                <td className="py-3 px-4">0.7</td>
                <td className="py-3 px-4 text-muted-foreground">Nucleus sampling parameter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="gpt35" className="mb-16">
        <h2 className="text-2xl font-bold mb-4">GPT-3.5 Model</h2>
        <p className="text-muted-foreground mb-4">
          GPT-3.5 is a fast and efficient model ideal for simpler tasks and quick responses.
        </p>
      </section>

      <section id="deepimg" className="mb-16">
        <h2 className="text-2xl font-bold mb-4">DeepImg Model</h2>
        <p className="text-muted-foreground mb-4">
          DeepImg is a high-quality image generation model supporting multiple artistic styles.
        </p>

        <h3 className="text-lg font-semibold mb-3">Available Styles</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {["default", "ghibli", "cyberpunk", "anime", "portrait", "3d"].map((style) => (
            <div key={style} className="rounded-lg border border-border p-3 text-center">
              <code className="text-primary">{style}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
