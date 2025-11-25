# P2A Bot v2 - Multi-Language Edition

P2A-Bot is a comprehensive Telegram group management bot available in **two language versions**: TypeScript (with Mastra AI) and Java (Spring Boot with SQLite).

## 🚀 Available Versions

### 1. TypeScript/JavaScript Version
**Location:** `/src`  
**Framework:** Mastra + Node.js  
**Database:** PostgreSQL  
**Status:** ✅ Production Ready

**Key Features:**
- AI-powered agent (GPT-4)
- Workflow orchestration with Inngest
- Memory management with conversation history
- Vector embeddings for semantic search
- Web dashboard for monitoring
- Advanced command parsing

**Tech Stack:**
- `@mastra/core` - Agent framework
- `@mastra/inngest` - Workflow orchestration
- `@ai-sdk/openai` - AI integration
- `@mastra/pg` - PostgreSQL storage
- `telegraf` - Telegram Bot API

### 2. Java Version v2 (GOAT Edition)
**Location:** `/java-bot`  
**Framework:** Spring Boot 3.2  
**Database:** SQLite (embedded)  
**Status:** ✅ Production Ready

**Key Features:**
- Lightweight Spring Boot 3.2 application
- SQLite database (no external DB needed)
- REST API with modular services
- Docker containerization
- Command-based interface
- Fast startup and execution

**Tech Stack:**
- Spring Boot 3.2
- Spring Data JPA
- SQLite with Hibernate
- Telegram Bot API (TelegramBots library)
- SLF4J + Logback logging

---

## 📋 Core Features (Both Versions)

### Moderation Tools
- ✅ Ban/Kick/Mute users
- ✅ Warning system with counting
- ✅ Unpin/Pin messages
- ✅ Delete messages
- ✅ User information retrieval

### Management Features
- ✅ Note saving and retrieval
- ✅ Content filtering
- ✅ Statistics tracking
- ✅ Chat preferences

### Bot Intelligence
- ✅ Natural language command parsing
- ✅ Context-aware responses
- ✅ Command help system

---

## 🎯 Version Comparison

| Aspect | TypeScript | Java |
|--------|-----------|------|
| **Language** | JavaScript/TypeScript | Java 21 |
| **Framework** | Mastra | Spring Boot |
| **Database** | PostgreSQL | SQLite |
| **AI Agent** | GPT-4 integrated | Command-based |
| **Startup Time** | ~5s | ~2s |
| **Memory Usage** | ~200MB | ~150MB |
| **Best For** | Advanced features | Simplicity |
| **Deployment** | Flexible | Docker-native |
| **Learning Curve** | Moderate | High |

---

## 🏗️ System Architecture

### TypeScript Architecture
```
src/
├── mastra/
│   ├── agents/          # AI Agent definition
│   ├── workflows/       # Workflow orchestration
│   ├── tools/           # Bot commands/tools
│   ├── storage/         # Database operations
│   └── index.ts         # Registration
├── triggers/            # Telegram webhook handler
└── index.ts            # Server entry point
```

### Java Architecture
```
java-bot/
├── src/main/java/com/p2abot/
│   ├── controller/      # REST endpoints
│   ├── service/         # Business logic
│   ├── model/           # Entity classes
│   ├── repository/      # Data access
│   ├── webhook/         # Telegram handler
│   └── P2ABotApplication.java
```

---

## 💾 Database Structure

Both versions use the same logical schema:

### Tables
1. **telegram_chats** - Group configuration
2. **bot_notes** - Saved notes per group
3. **bot_filters** - Content filters
4. **bot_warnings** - User warnings
5. **bot_stats** - Chat statistics

### Storage Differences
- **TypeScript:** PostgreSQL with pgvector extension
- **Java:** SQLite (embedded file-based)

---

## 🚀 Quick Start

### TypeScript
```bash
# Set environment
export TELEGRAM_BOT_TOKEN="your_token"
export OPENAI_API_KEY="your_key"

# Run
npm install
npm run dev
```

### Java
```bash
cd java-bot

# Set environment
export TELEGRAM_BOT_TOKEN="your_token"

# Run
mvn clean package
java -jar target/p2a-bot-java-2.0.0.jar
```

---

## 📦 Deployment Options

### Supported Platforms
- ✅ Replit (TypeScript native)
- ✅ Render.com (Both)
- ✅ Railway.app (Both)
- ✅ Docker (Both)
- ✅ Heroku (Both - requires payment)
- ✅ Local machine (Both)

### Docker Support
Both versions include `Dockerfile` for containerization.

---

## 🔌 Environment Variables

### TypeScript
```
TELEGRAM_BOT_TOKEN        # Telegram bot token
OPENAI_API_KEY           # OpenAI API key
DATABASE_URL             # PostgreSQL connection
PGHOST, PGPORT, etc      # PG credentials
SESSION_SECRET           # Session encryption
```

### Java
```
TELEGRAM_BOT_TOKEN       # Telegram bot token
```
Note: SQLite database auto-creates locally

---

## 📚 Documentation

- **[Getting Started Guide](./GETTING_STARTED.md)** - Choose and setup version
- **[Version Comparison](./VERSIONS.md)** - Detailed feature comparison
- **[TypeScript README](./README.md)** - Full TypeScript docs
- **[Java README](./java-bot/README.md)** - Full Java docs
- **[TypeScript Setup](./SETUP.md)** - TypeScript deployment guide
- **[Java Setup](./java-bot/SETUP.md)** - Java deployment guide

---

## 👨‍💼 Developer

**Gtajisan** - Creator of P2A Bot v2

Both versions developed with focus on:
- 🎯 Ease of deployment
- 📖 Clear documentation
- 🔒 Security best practices
- ⚡ Performance optimization
- 🛠️ Developer experience

---

## 🎓 Learning Resources

### TypeScript Version
- Mastra: https://mastra.ai
- Telegraf: https://telegraf.js.org
- Inngest: https://www.inngest.com

### Java Version
- Spring Boot: https://spring.io/projects/spring-boot
- Hibernate: https://hibernate.org
- TelegramBots: https://core.telegram.org/bots

---

## 🔄 Workflow Examples

### TypeScript Workflow
Message received → Webhook trigger → Mastra agent → Tool execution → Response sent

### Java Workflow
Message received → REST endpoint → Controller → Service → Repository → Telegram API

---

## 🛡️ Security Features

- Environment variable-based configuration
- No secrets in code
- Direct Telegram API HTTP calls (no bot instance storage)
- Input validation
- Error handling with fallbacks
- Comprehensive logging

---

## 📊 Logging

Both versions use structured logging:

**TypeScript:**
- Pino logger with JSON output
- Log levels: DEBUG, INFO, WARN, ERROR

**Java:**
- SLF4J + Logback
- Same levels + TRACE

Example logs:
```
🚀 [BotStart] Starting P2A Bot
💬 [WebhookController] Processing message from user 12345
🔧 [TelegramBotService] Sending message to chat 67890
✅ [Response] Success with action: ban_user
```

---

## 🎯 Feature Implementation

### Both Versions Support
- `/start` - Welcome
- `/help` - Commands
- `/ban`, `/kick`, `/warn` - Moderation
- `/note save/get/list/delete` - Notes
- `/stats` - Statistics

### TypeScript Additional
- AI-powered responses
- `/dashboard` - Web interface
- Advanced filtering
- Memory/context awareness

---

## 📝 File Semantics

### TypeScript Key Files
- `src/mastra/index.ts` - Main registration
- `src/mastra/agents/p2aBotAgent.ts` - AI Agent
- `src/mastra/workflows/p2aBotWorkflow.ts` - Workflow
- `src/mastra/tools/` - Bot commands

### Java Key Files
- `P2ABotApplication.java` - Main entry point
- `TelegramWebhookController.java` - Message handler
- `service/*.java` - Business logic
- `model/*.java` - Database entities

---

## 🚨 Current Status

✅ **Both versions are production-ready**
- Database schemas initialized
- All core features implemented
- Webhook handlers configured
- Logging integrated
- Error handling in place

---

## 📌 User Preferences

- **Communication Style:** Simple, everyday language
- **Deployment:** Easy setup on free platforms
- **Documentation:** Clear and comprehensive
- **Code Style:** Well-structured and logged

---

## 🎓 Development Guidelines

### Logging Requirements
Add extensive logging to all Mastra/Spring components:
- Tool execution
- Workflow steps
- Service operations
- Error conditions

### Never
- Don't change Replit workflows
- Don't add secrets to code
- Don't instantiate bot multiple times

---

## 🔗 Quick Links

- [TypeScript Setup](./SETUP.md)
- [Java Setup](./java-bot/SETUP.md)
- [Getting Started](./GETTING_STARTED.md)
- [GitHub](https://github.com/gtajisan/p2a-bot)
- [Telegram Bot API](https://core.telegram.org/bots)

---

Last Updated: November 25, 2024  
Version: 2.0.0 (Multi-Language Edition)
