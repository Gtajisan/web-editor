# 🤖 Anbu AI

A modern, multilingual AI interface platform powered by Next.js 16, featuring advanced chat capabilities and image generation.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ Features

- 🌐 **Multilingual Support** - 5 languages (English, Bengali, Japanese, Vietnamese, Hindi)
- 💬 **AI Chat Interface** - Advanced conversational AI with multiple models
- 🎨 **Image Generation** - AI-powered image creation
- 🎯 **Model Selection** - Choose from various AI models
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🌙 **Dark Mode** - Built-in theme support
- 📊 **Real-time Status** - Live system monitoring
- 📝 **Auto-generated Changelog** - Git-based version history
- 🔒 **API Obfuscation** - Built-in request/response encryption
- ⚡ **Turbopack** - Lightning-fast development with Next.js 16

## 🚀 Quick Start

### Installation

```bash
git clone https://github.com/anbuinfosec/anbuai
```

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Or use the start script
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
# Create production build
npm run build

# Start production server
npm run prod
```

## 📦 Tech Stack

- **Framework:** Next.js 16.0.4 (App Router + Turbopack)
- **Language:** TypeScript 5.9.3
- **Styling:** Tailwind CSS 4.1.17
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **State Management:** React Context + Zustand
- **Package Manager:** pnpm

## 🏗️ Project Structure

```
anbuai/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   ├── chat/            # Chat API endpoint
│   │   ├── image/           # Image generation API
│   │   ├── status/          # System status API
│   │   └── changelog/       # Git changelog API
│   ├── playground/          # Interactive AI playground
│   ├── docs/                # Documentation
│   ├── models/              # Model information
│   ├── about/               # About page
│   └── contact/             # Contact page
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── playground/          # Playground-specific components
│   └── docs/                # Documentation components
├── lib/                     # Utility functions
│   ├── i18n.tsx            # Internationalization
│   ├── chat-store.ts       # Chat state management
│   ├── obfuscator.ts       # API encryption utility
│   └── utils.ts            # Helper functions
├── hooks/                   # Custom React hooks
├── public/                  # Static assets
└── styles/                  # Global styles

```

## 🌍 Supported Languages

- 🇬🇧 English
- 🇧🇩 Bengali (বাংলা)
- 🇯🇵 Japanese (日本語)
- 🇻🇳 Vietnamese (Tiếng Việt)
- 🇮🇳 Hindi (हिंदी)

Language preferences are automatically saved to localStorage.

## 🎮 Available Models

### Chat Models
- GPT-4 Turbo
- GPT-3.5 Turbo
- Claude 3 Opus
- Claude 3 Sonnet
- Gemini Pro
- Llama 2

### Image Models
- DALL-E 3
- Stable Diffusion XL
- Midjourney
- Stable Diffusion 2.1

## 📡 API Endpoints

### Chat API
```bash
POST /api/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "model": "gpt-4-turbo"
}
```

### Image Generation API
```bash
POST /api/image
Content-Type: application/json

{
  "prompt": "A beautiful sunset",
  "model": "dall-e-3"
}
```

### Status API
```bash
GET /api/status
```

### Changelog API
```bash
# Fetch changelog from GitHub repository
GET /api/changelog?repo=owner/repo

# Example response
{
  "changelog": [
    {
      "date": "2025-11-25",
      "commits": [...]
    }
  ],
  "totalCommits": 50,
  "repository": "owner/repo",
  "timestamp": "2025-11-25T12:00:00.000Z"
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Keys
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_API_KEY=your_google_api_key

# GitHub Configuration (for Changelog)
GITHUB_REPO=owner/repo
GITHUB_TOKEN=ghp_your_token  # Optional, for higher rate limits
NEXT_PUBLIC_GITHUB_REPO=owner/repo

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**GitHub Token Setup:**
1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Generate a new token with `repo` scope
3. Add it to your `.env.local` file

Without a token, you'll be limited to 60 requests/hour. With a token, you get 5,000 requests/hour.

### Tailwind Configuration

Customize theme in `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        // Add your custom colors
      },
    },
  },
}
```

## 🛠️ Development Tools

### Code Quality
- **TypeScript** - Static type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting (recommended)

### Scripts

```bash
npm run dev          # Start development server
npm start            # Alias for npm run dev
npm run build        # Build for production
npm run prod         # Start production server
npm run lint         # Run ESLint
```

## 📊 Monitoring

### Status Page
Visit `/status` to view:
- System health
- API availability
- Memory usage
- Uptime statistics
- Recent incidents

### Changelog
Visit `/changelog` to view:
- GitHub commit history
- File change statistics
- Author information
- Detailed commit messages

**Note:** Requires `GITHUB_REPO` environment variable to be set.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Guidelines

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Vercel](https://vercel.com/) - Deployment platform
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide](https://lucide.dev/) - Icons

## 📞 Support

- 📧 Email: support@anbuai.com
- 💬 Telegram: [Join our community](https://t.me/anbuai)
- 🐛 Issues: [GitHub Issues](https://github.com/anbuai/anbuai/issues)

## 🗺️ Roadmap

- [ ] Voice input/output
- [ ] File upload support
- [ ] Code execution environment
- [ ] Custom model training
- [ ] API rate limiting
- [ ] User authentication
- [ ] Usage analytics
- [ ] Mobile app

---

Made with ❤️ by @anbuinfosec
