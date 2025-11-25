# P2A-Bot v2 - Complete Setup Guide

Multi-version Telegram group management bot with **TypeScript (Mastra)** and **Java (Spring Boot)** editions.

## 🎯 Quick Overview

| Version | Tech | Database | Setup Time | Best For |
|---------|------|----------|-----------|----------|
| **TypeScript** | Node.js + Mastra | PostgreSQL | 10 min | AI + Advanced Features |
| **Java** | Spring Boot 3.2 | SQLite | 5 min | Lightweight + Fast |

---

## 📋 Prerequisites

### System Requirements
- **Memory:** 1GB minimum (2GB recommended)
- **Disk:** 500MB free space
- **Network:** Internet connection required

### Both Versions Need
```bash
# Get Telegram Bot Token
1. Search @BotFather on Telegram
2. Send: /newbot
3. Follow wizard
4. Copy token
```

---

## 🚀 TypeScript Version Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment
```bash
export TELEGRAM_BOT_TOKEN="your_token_here"
export OPENAI_API_KEY="your_openai_key"  # Optional for AI
```

### 3. Create Database
```bash
# Database URL auto-created by Replit
# Connection string in DATABASE_URL env var
```

### 4. Start Dev Server
```bash
npm run dev
# or
mastra dev
```

**Server runs on:** `http://localhost:5000`

### 5. Test
```bash
# Playground
http://localhost:5000/

# API
curl http://localhost:5000/api/health
```

---

## 🐐 Java Version Setup

### 1. Build
```bash
cd java-bot
mvn clean package
```

### 2. Set Environment
```bash
export TELEGRAM_BOT_TOKEN="your_token_here"
```

### 3. Run
```bash
java -jar target/p2a-bot-java-2.0.0.jar
# or
./run.sh
```

**Server runs on:** `http://localhost:8080`

### 4. Test
```bash
# Health check
curl http://localhost:8080/api/health

# Bot info
curl http://localhost:8080/api/health/info

# Database status
curl http://localhost:8080/api/database/status
```

---

## 📱 Telegram Configuration

### Set Webhook (TypeScript)
```bash
curl -X POST https://api.telegram.org/bot{TOKEN}/setWebhook \
  -d url=https://your-app.com/api/webhook/telegram
```

### Set Webhook (Java)
```bash
curl -X POST https://api.telegram.org/bot{TOKEN}/setWebhook \
  -d url=https://your-app.com/api/webhook/telegram
```

---

## 🐳 Docker Deployment

### TypeScript
```bash
docker build -t p2a-bot .
docker run -e TELEGRAM_BOT_TOKEN=token -p 5000:5000 p2a-bot
```

### Java
```bash
cd java-bot
docker build -t p2a-bot-java .
docker run -e TELEGRAM_BOT_TOKEN=token -p 8080:8080 p2a-bot-java
```

---

## 🌐 Cloud Deployment

### Render.com (Free - Recommended)

**TypeScript:**
1. Push to GitHub
2. Create new Web Service on Render
3. Connect repo (root directory)
4. Set env: `TELEGRAM_BOT_TOKEN`, `DATABASE_URL`, `OPENAI_API_KEY`
5. Deploy!

**Java:**
1. Push to GitHub
2. Create new Web Service on Render
3. Connect repo with base directory: `java-bot`
4. Set env: `TELEGRAM_BOT_TOKEN`
5. Deploy!

### Railway.app
1. Import from GitHub
2. Add environment variables
3. Deploy

### Heroku (Paid)
```bash
heroku create p2a-bot
heroku config:set TELEGRAM_BOT_TOKEN=token
git push heroku main
```

---

## 🎮 Available Commands

### Both Versions
```
/start      - Welcome message
/help       - Show all commands
/stats      - Display statistics
/ban        - Ban user
/kick       - Kick user
/warn       - Warn user
/note       - Manage notes
/filter     - Manage filters
/info       - Bot information
```

### TypeScript Exclusive
```
/dashboard  - Web dashboard
/ai         - AI-powered responses
```

### Java Exclusive
```
/mute       - Mute user
/purge      - Delete messages
/welcome    - Set welcome message
```

---

## 📊 API Endpoints

### TypeScript
```
GET  /api/health
GET  /api/workflow/status
POST /api/workflow/trigger
GET  /api/agent/status
```

### Java
```
GET    /api/health
GET    /api/health/info
GET    /api/bot/{chatId}/notes
POST   /api/bot/{chatId}/notes
GET    /api/bot/{chatId}/stats
GET    /api/database/status
POST   /api/webhook/telegram
```

---

## 💾 Database Structure

### Tables (Both Versions)
```
telegram_chats    - Group configuration
bot_notes         - Saved notes
bot_filters       - Content filters
bot_warnings      - User warnings
bot_stats         - Chat statistics
```

### TypeScript: PostgreSQL
- Hosted externally
- Vector embeddings support
- Connection: `DATABASE_URL`

### Java: SQLite
- Embedded in app
- Auto-creates: `p2a-bot-data.db`
- No setup needed

---

## 🧪 Testing

### Test TypeScript Locally
```bash
npm test
# or manually with curl
curl http://localhost:5000/api/health
```

### Test Java Locally
```bash
# Check database
curl http://localhost:8080/api/database/status

# List tables
curl http://localhost:8080/api/database/tables

# Get bot info
curl http://localhost:8080/api/health/info
```

---

## 📁 Project Structure

### TypeScript
```
src/
├── mastra/
│   ├── agents/      # AI Agent
│   ├── workflows/   # Workflows
│   ├── tools/       # Commands
│   └── index.ts
├── triggers/        # Webhook
└── index.ts
```

### Java
```
java-bot/src/main/java/com/p2abot/
├── command/         # Commands
├── service/         # Services
├── model/           # Entities
├── repository/      # Data access
├── controller/      # API endpoints
└── webhook/         # Telegram webhook
```

---

## 🔒 Security Notes

- ✅ No secrets in code
- ✅ Environment variables only
- ✅ Input validation
- ✅ Error handling
- ✅ SQLite auto-encrypts data at rest (Java)
- ✅ PostgreSQL secure connections (TypeScript)

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Bot doesn't respond | Check token, restart, check logs |
| Port 5000/8080 in use | Kill process or change port |
| Database error | Delete DB file, restart (auto-creates) |
| Webhook not working | Verify URL is public and accessible |
| Permission errors | Check bot has admin rights in group |

---

## 📚 Documentation Files

- **[TypeScript README](./README.md)** - Full TypeScript docs
- **[Java README](./java-bot/README.md)** - Full Java docs
- **[Java API](./java-bot/API.md)** - Java REST API
- **[Java Structure](./java-bot/STRUCTURE.md)** - Java architecture
- **[Version Comparison](./VERSIONS.md)** - Feature comparison
- **[Migration Guide](./MIGRATION_GUIDE.md)** - Version migration
- **[Getting Started](./GETTING_STARTED.md)** - Quick start guide

---

## 🚀 Next Steps

1. ✅ Choose version (TypeScript or Java)
2. ✅ Get bot token from @BotFather
3. ✅ Follow setup for your version
4. ✅ Test locally
5. ✅ Deploy to cloud
6. ✅ Set webhook in Telegram
7. ✅ Monitor with logs

---

## 💡 Pro Tips

- **Development:** Use local setup first, then deploy
- **Testing:** Use Telegram @BotFather's test mode
- **Monitoring:** Check logs regularly for issues
- **Backup:** Backup SQLite database (Java) or PostgreSQL (TypeScript)
- **Updates:** Keep dependencies updated for security

---

## 📞 Support

- 📖 See documentation files above
- 🐛 Check logs for detailed errors
- 💬 Review command help: `/help`
- 🔍 Use bot info: `/info`

---

**Version:** 2.0.0  
**Created by:** Gtajisan  
**Last Updated:** November 25, 2024
