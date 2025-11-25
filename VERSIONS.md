# P2A Bot - Version Comparison

## 📦 Available Versions

### TypeScript Version (Original)
**Location:** `/src`  
**Framework:** Mastra + Node.js  
**Database:** PostgreSQL  
**Best For:** Advanced AI features, quick development, production deployment

**Features:**
- ✅ Mastra framework with workflow orchestration
- ✅ AI-powered agent (GPT-4)
- ✅ PostgreSQL with vector embeddings
- ✅ Inngest for durable execution
- ✅ Memory management
- ✅ Web dashboard
- ✅ Production-ready logging

**Setup Time:** ~10 minutes  
**Deployment:** Replit, Vercel, Render, Railway

**Command:**
```bash
npm install
npm run dev
# or mastra dev
```

---

### Java Version v2 (GOAT Edition)
**Location:** `/java-bot`  
**Framework:** Spring Boot 3.2  
**Database:** SQLite (embedded)  
**Best For:** Lightweight deployment, offline-first, Java developers

**Features:**
- ✅ Spring Boot 3.2 with Java 21
- ✅ SQLite (no external DB)
- ✅ REST API endpoints
- ✅ Modular service architecture
- ✅ Docker support
- ✅ Command-based interface
- ✅ Comprehensive logging

**Setup Time:** ~5 minutes  
**Deployment:** Docker, Render, Railway, Heroku, Local

**Command:**
```bash
cd java-bot
mvn clean package
java -jar target/p2a-bot-java-2.0.0.jar
```

---

## 🔄 Comparison Table

| Feature | TypeScript | Java |
|---------|-----------|------|
| Framework | Mastra | Spring Boot |
| Database | PostgreSQL | SQLite |
| Language | JavaScript/TS | Java 21 |
| External DB | Required | Not needed |
| AI Agent | GPT-4 integrated | Command-based |
| Setup Time | 10 min | 5 min |
| Learning Curve | Moderate | High |
| Code Size | ~2000 LOC | ~1500 LOC |
| Performance | High | Very High |
| Scalability | Cloud-ready | Lightweight |
| Docker | ✅ | ✅ |
| Cost | Low (no server cost) | Very Low |

---

## 🚀 Quick Start Guide

### TypeScript (Mastra + Node.js)

```bash
# 1. Install dependencies
npm install

# 2. Set environment
export TELEGRAM_BOT_TOKEN="your_token"
export OPENAI_API_KEY="your_key"

# 3. Run
npm run dev

# 4. Test
curl http://localhost:3000/health
```

### Java (Spring Boot)

```bash
# 1. Navigate to Java project
cd java-bot

# 2. Set environment
export TELEGRAM_BOT_TOKEN="your_token"

# 3. Build and run
mvn clean package
java -jar target/p2a-bot-java-2.0.0.jar

# 4. Test
curl http://localhost:8080/api/health
```

---

## 📋 Command Support

### TypeScript Version
- `/start` - Welcome message
- `/help` - Show commands
- `/ban`, `/kick`, `/mute` - Moderation
- `/warn`, `/unwarn` - User management
- `/note save/get/list/delete` - Notes
- `/filter add/list/remove` - Content filters
- `/stats` - Chat statistics
- `/dashboard` - Web interface

### Java Version
- `/start` - Welcome message
- `/help` - Show commands
- `/ban`, `/kick`, `/warn` - Moderation
- `/note save/get/list/delete` - Notes
- `/stats` - Chat statistics
- `/delete`, `/pin` - Message management

---

## 💾 Database Schema

### TypeScript (PostgreSQL)
```
bot_notes
├── id (UUID)
├── chatId (bigint)
├── noteKey (text)
├── noteContent (text)
└── timestamps

bot_filters
├── id (UUID)
├── chatId (bigint)
├── pattern (text)
├── replacement (text)
└── regex (boolean)

bot_warnings
├── id (UUID)
├── chatId (bigint)
├── userId (bigint)
├── reason (text)
└── warningCount (integer)

bot_stats
├── id (bigint)
├── chatId (bigint)
├── totalMessages (bigint)
├── usersWarned (bigint)
├── usersKicked (bigint)
└── usersBanned (bigint)
```

### Java (SQLite)
Same schema but with SQLite data types:
- `INTEGER` for IDs
- `TEXT` for strings
- `BOOLEAN` for flags
- Auto-incrementing primary keys

---

## 🎯 When to Use Each

### Use **TypeScript** if you:
- Need AI-powered responses
- Want advanced workflow orchestration
- Require production-grade scaling
- Prefer Node.js ecosystem
- Need memory/embedding features
- Have PostgreSQL available

### Use **Java** if you:
- Want lightweight deployment
- Prefer Spring Boot ecosystem
- Don't need external database
- Need faster performance
- Want Docker containers
- Prefer Java tooling

---

## 📊 Performance Metrics

### TypeScript
- Memory: ~200MB (Mastra + Node.js)
- Startup: ~5 seconds
- Response time: ~100-200ms (with AI)
- Database queries: ~5-10ms

### Java
- Memory: ~150MB (Spring Boot)
- Startup: ~2 seconds
- Response time: ~50ms
- Database queries: ~1-3ms

---

## 🔗 Additional Resources

- **TypeScript Docs:** See `/README.md`
- **Java Docs:** See `/java-bot/README.md`
- **TypeScript Setup:** See `/SETUP.md`
- **Java Setup:** See `/java-bot/SETUP.md`

---

## 👤 Developer

**Gtajisan** - Creator of P2A Bot v2

Both versions created with ❤️ for Telegram group management.

---

## 📝 License

MIT License - Free for personal and commercial use
