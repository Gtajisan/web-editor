# 🚀 FRN AI

Modern, multilingual AI interface platform powered by Next.js 16, featuring advanced chat capabilities and image generation.

A feature-rich AI platform with multilingual support, voice assistance, and image editing. Powered by free open-source AI APIs with zero configuration.

**Live Demo:** [Deploy to Vercel](#deploying-to-vercel)

---

## ✨ Features

- 💬 **AI Chat Interface** - Real-time conversations with multiple AI models
- 🎨 **Image Generation** - Create images from text descriptions
- 🎤 **Voice Assistant** - Speak to AI with speech recognition and text-to-speech
- ✏️ **Image Editor** - Upload and edit images with AI enhancement
- 🌐 **Multilingual Support** - 5+ languages (English, Bengali, Japanese, Vietnamese, Hindi)
- 🌙 **Dark Mode** - Built-in theme switching
- 📱 **Fully Responsive** - Works seamlessly on all devices
- ✅ **100% Free APIs** - No API keys required, completely open-source
- ⚡ **Lightning Fast** - Powered by Next.js 16 with Turbopack

---

## 🎯 What's Different

✅ **Created by Gtajisan** - A powerful AI platform tailored for accessibility and performance
✅ **Multiple Free AI Providers** - Groq, HuggingFace, Unsplash, Pixabay, Pexels
✅ **No Authentication** - Start using immediately without sign-up
✅ **Production Ready** - Optimized for Vercel deployment
✅ **Modern UI** - Clean, responsive design with Radix UI components

---

## 🛠 Tech Stack

- **Frontend:** Next.js 16.0.4, React 19.2.0, TypeScript 5.9.3
- **Styling:** Tailwind CSS 4.1.17, Radix UI Components
- **Icons:** Lucide React
- **State Management:** React Context
- **Package Manager:** npm/pnpm
- **Deployment:** Vercel, Edge Runtime Ready

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Local Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/frn-ai.git
cd frn-ai

# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🚀 Deploying to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Ffrn-ai&project-name=frn-ai&repo-name=frn-ai)

### Option 2: Manual Deployment

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/frn-ai.git
git push -u origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Framework: **Next.js**
   - Click "Deploy"

3. **Environment Variables** (if needed)
   - No environment variables required for free tier!
   - All APIs are public and don't require authentication

### Vercel Project Settings

```
Framework: Next.js
Build Command: npm run build
Start Command: npm start
Node.js Version: 18.x or higher
```

---

## 📖 Available Routes

### Main Pages
- `/` - Home page with features
- `/playground` - Interactive AI chat interface
- `/image-editor` - Image generation and editing
- `/voice-assistant` - Voice-based AI interaction
- `/models` - Available AI models list
- `/docs` - API documentation
- `/about` - About FRN AI
- `/contact` - Contact information
- `/privacy` - Privacy policy
- `/terms` - Terms of service

### API Endpoints
- `POST /api/chat` - Chat with AI
- `POST /api/image` - Generate images
- `POST /api/voice` - Voice processing
- `POST /api/edit-image` - Edit images
- `POST /api/upload` - Upload images

---

## 🎮 Usage Examples

### Chat API
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is machine learning?",
    "model": "gpt-3.5"
  }'
```

### Image Generation API
```bash
curl -X POST http://localhost:3000/api/image \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset over mountains",
    "size": "1:1"
  }'
```

### Voice Assistant API
```bash
curl -X POST http://localhost:3000/api/voice \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Tell me about artificial intelligence"
  }'
```

---

## 🌍 AI Providers Used

### Chat Models
- **Groq API** - Free, unlimited requests, no auth
- **HuggingFace Inference** - Free tier, open models

### Image Generation
- **Unsplash** - Stock photos (free)
- **HuggingFace Diffusers** - AI image generation (free)
- **Pixabay** - Stock images (free)
- **Pexels** - Stock photos (free)

### Voice
- **Browser Web Speech API** - Native speech recognition
- **Text-to-Speech** - Browser built-in

---

## 🔧 Development

### Build for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

### Project Structure
```
frn-ai/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── chat/            # Chat endpoint
│   │   ├── image/           # Image generation
│   │   ├── voice/           # Voice processing
│   │   ├── edit-image/      # Image editing
│   │   └── upload/          # File upload
│   ├── playground/          # Chat interface
│   ├── image-editor/        # Image editor page
│   ├── voice-assistant/     # Voice assistant page
│   ├── models/              # Models listing
│   ├── docs/                # Documentation
│   ├── about/               # About page
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── ui/                  # UI components (Radix)
│   ├── playground/          # Playground components
│   ├── header.tsx           # Navigation header
│   ├── footer.tsx           # Footer
│   ├── voice-assistant.tsx  # Voice component
│   ├── image-editor.tsx     # Image editor component
│   └── ...
├── lib/                     # Utility functions
│   ├── i18n.tsx            # Internationalization
│   └── utils.ts            # Helpers
├── public/                  # Static assets
├── styles/                  # Global styles
└── package.json            # Dependencies
```

---

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Desktop optimization
- ✅ Tablet support
- ✅ Dark mode by default
- ✅ Touch-friendly interface

---

## 🌐 Internationalization

Supported languages:
- 🇬🇧 English
- 🇧🇩 Bengali (বাংলা)
- 🇯🇵 Japanese (日本語)
- 🇻🇳 Vietnamese (Tiếng Việt)
- 🇮🇳 Hindi (हिंदी)

Language preference is automatically saved to localStorage.

---

## 🔒 Privacy & Security

- ✅ No user registration required
- ✅ No data stored on servers (all processing is stateless)
- ✅ Local storage for chat history (browser-side only)
- ✅ HTTPS enforced on Vercel
- ✅ No tracking cookies
- ✅ Open-source and transparent

See [Privacy Policy](/privacy) for details.

---

## 📞 Support & Contact

**Developer:** Gtajisan

### Connect With Me:
- 🐙 [GitHub](https://github.com/frnwot)
- 💬 [Telegram](https://t.me/FARHAN_MUH_TASIM)
- 🎬 [YouTube](https://youtube.com/@zerox-farhan)
- 📸 [Instagram](https://www.instagram.com/frn_prime/)
- 👨‍💼 [LinkedIn](https://linkedin.com/in/jisan-ff)
- 🎨 [CodePen](https://codepen.io/jisan-ff)
- 📢 [Telegram Community](https://t.me/Farhan_build_discussion)
- 📧 [Email](mailto:contact@frn-ai.com)

---

## 📄 License

This project is open-source and available under the MIT License. See [LICENSE](LICENSE) file for details.

---

## 🎉 Getting Started Quick Links

- 🏠 [Home Page](http://localhost:3000)
- 🤖 [Chat Interface](http://localhost:3000/playground)
- 🎨 [Image Generator](http://localhost:3000/playground)
- 🎤 [Voice Assistant](http://localhost:3000/voice-assistant)
- ✏️ [Image Editor](http://localhost:3000/image-editor)
- 📚 [Documentation](http://localhost:3000/docs)

---

## 🚀 Deployment Checklist

Before deploying to Vercel, ensure:

- [ ] Repository pushed to GitHub
- [ ] All dependencies installed: `npm install`
- [ ] Build succeeds locally: `npm run build`
- [ ] No environment variables needed (all free APIs)
- [ ] Tests pass: `npm run lint`
- [ ] README updated with your details
- [ ] Social links updated in `components/footer.tsx`
- [ ] Contact information updated in `app/contact/page.tsx`

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## ⭐ Star This Project

If you find FRN AI useful, please consider giving it a star on GitHub!

---

**Made with ❤️ by Gtajisan**

Last Updated: November 2025
