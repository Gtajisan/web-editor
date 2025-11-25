# 🚀 Getting Started with P2A Bot

This guide helps you choose and set up the right version for your needs.

## 📌 Choose Your Version

### Option 1: TypeScript (Mastra) - ⭐ Recommended for Production
- **Best for:** Advanced features, AI responses, scalability
- **Setup time:** 10 minutes
- **Technology:** Node.js + Mastra + PostgreSQL
- **Ideal for:** Developers familiar with JavaScript/TypeScript

**[→ TypeScript Setup Guide](./SETUP.md)**

### Option 2: Java (Spring Boot) - 🐐 GOAT Lightweight Edition
- **Best for:** Lightweight, fast, no database hassle
- **Setup time:** 5 minutes
- **Technology:** Java 21 + Spring Boot + SQLite
- **Ideal for:** Java developers, simple deployments

**[→ Java Setup Guide](./java-bot/SETUP.md)**

### Need Help Choosing?
See [Version Comparison](./VERSIONS.md)

---

## ⚡ Quick Start (TypeScript)

### 1. Get Telegram Bot Token
```bash
# Search @BotFather on Telegram
# Send: /newbot
# Copy the token
```

### 2. Setup Environment
```bash
export TELEGRAM_BOT_TOKEN="your_token_here"
export OPENAI_API_KEY="your_openai_key"  # Optional, for AI
```

### 3. Install & Run
```bash
npm install
npm run dev
```

### 4. Test
```bash
# Find your bot on Telegram
# Send: /help
# Bot should respond!
```

---

## ⚡ Quick Start (Java)

### 1. Get Telegram Bot Token
```bash
# Search @BotFather on Telegram
# Send: /newbot
# Copy the token
```

### 2. Setup Environment
```bash
export TELEGRAM_BOT_TOKEN="your_token_here"
```

### 3. Build & Run
```bash
cd java-bot
mvn clean package
java -jar target/p2a-bot-java-2.0.0.jar
```

### 4. Test
```bash
# Find your bot on Telegram
# Send: /help
# Bot should respond!
```

---

## 🌐 Deployment Options

### Local Development
- TypeScript: `npm run dev`
- Java: `java -jar target/p2a-bot-java-2.0.0.jar`

### Docker
```bash
# TypeScript
docker build -t p2a-bot .
docker run -e TELEGRAM_BOT_TOKEN=token p2a-bot

# Java
cd java-bot
docker build -t p2a-bot-java .
docker run -e TELEGRAM_BOT_TOKEN=token -p 8080:8080 p2a-bot-java
```

### Cloud Platforms

**Render.com** (Recommended - Free)
1. Push code to GitHub
2. Create Web Service on Render
3. Connect repo
4. Set `TELEGRAM_BOT_TOKEN` env var
5. Deploy!

**Railway.app**
1. Import from GitHub
2. Set `TELEGRAM_BOT_TOKEN`
3. Deploy

**Heroku** (Paid)
```bash
heroku create your-bot-name
heroku config:set TELEGRAM_BOT_TOKEN=your_token
git push heroku main
```

---

## 🔧 Common Commands

### TypeScript
```bash
npm install              # Install dependencies
npm run dev             # Development mode
npm run build           # Build for production
npm start               # Production mode
mastra dev              # Start Mastra dev server
```

### Java
```bash
mvn clean package       # Build the project
java -jar *.jar         # Run the app
mvn spring-boot:run     # Development mode
mvn test                # Run tests
```

---

## 📚 Documentation

- **[TypeScript README](./README.md)** - Full TypeScript documentation
- **[Java README](./java-bot/README.md)** - Full Java documentation
- **[Version Comparison](./VERSIONS.md)** - Detailed feature comparison
- **[Architecture](./docs)** - System design documents

---

## 💡 Tips

1. **Test locally first** before deploying
2. **Check bot permissions** - admin rights needed for moderation
3. **Monitor logs** - helps troubleshoot issues
4. **Use webhooks** - more efficient than polling
5. **Rate limit** - Telegram has API rate limits

---

## ❓ FAQ

**Q: Which version should I use?**  
A: Use TypeScript if you need AI features; Java if you want simplicity.

**Q: Do I need PostgreSQL?**  
A: Only for TypeScript. Java uses SQLite (built-in).

**Q: Can I use both versions?**  
A: Yes! You can deploy both and have separate bots.

**Q: What if my bot doesn't respond?**  
A: Check webhook URL, bot token, and logs.

**Q: How do I add more commands?**  
A: Edit the command handlers in respective controllers.

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Bot doesn't respond | Check TELEGRAM_BOT_TOKEN, restart |
| Port already in use | Change port or stop other services |
| Database error | Delete db file, restart (auto-creates) |
| Deployment fails | Check env vars, logs, and permissions |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

---

## 📞 Support

- 🐛 Report bugs on GitHub
- 💬 Ask questions in Discussions
- 📧 Contact: support@p2abot.dev

---

## 🎉 Ready?

**[Start with TypeScript →](./SETUP.md)**  
**[Start with Java →](./java-bot/SETUP.md)**

Developed by: **Gtajisan** ❤️
