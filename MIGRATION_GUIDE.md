# Migration Guide: TypeScript vs Java

Choose the right P2A-Bot version for your needs.

## 🎯 Quick Decision Matrix

| Your Need | Best Choice | Why |
|-----------|-------------|-----|
| Need AI responses | TypeScript | Mastra + GPT-4 integration |
| Want lightweight bot | Java | SQLite, fast startup |
| Prefer JavaScript | TypeScript | Node.js ecosystem |
| Prefer Java | Java | Spring Boot 3.2 |
| Don't want external DB | Java | SQLite built-in |
| Need PostgreSQL | TypeScript | pgvector support |
| Quick deployment | Java | 5 min setup |
| Advanced features | TypeScript | Workflow orchestration |

## 🔄 Comparison

### TypeScript (Original)
```
npm install
npm run dev
🎯 Features: AI, Workflows, Dashboard
📦 Size: ~2000 LOC
⚡ Startup: ~5s
💾 Database: PostgreSQL
```

### Java (GOAT Edition)
```
mvn clean package
java -jar target/*.jar
🎯 Features: Commands, Filters, Notes
📦 Size: ~1500 LOC
⚡ Startup: ~2s
💾 Database: SQLite
```

## 📊 Feature Comparison

### Shared Features (Both Versions)
✅ User moderation (ban, kick, warn)  
✅ Note management  
✅ Content filtering  
✅ Statistics tracking  
✅ Message handling  
✅ REST API  
✅ Docker support  
✅ Comprehensive logging  

### TypeScript Exclusive
✅ AI-powered responses (GPT-4)  
✅ Workflow orchestration (Inngest)  
✅ Web dashboard  
✅ Memory/conversation history  
✅ Vector embeddings  
✅ Production-grade scaling  

### Java Exclusive
✅ Lightweight deployment  
✅ Embedded SQLite (no setup)  
✅ Faster startup time  
✅ Lower memory footprint  
✅ Spring Boot ecosystem  
✅ JPA/Hibernate ORM  

## 🚀 Running Both Versions

You can run BOTH simultaneously:

```bash
# Terminal 1: TypeScript
npm run dev  # Runs on port 3000

# Terminal 2: Java
cd java-bot
java -jar target/*.jar  # Runs on port 8080
```

But they need **different bot tokens**:
- TypeScript bot → one Telegram bot
- Java bot → another Telegram bot

## 🔄 Data Migration

### TypeScript → Java
Not directly supported. Each version uses different databases.

If you want to migrate:
1. Export data from PostgreSQL
2. Transform to SQLite format
3. Import into Java bot

### Java → TypeScript
Same process in reverse.

## 📱 Webhook Setup

### TypeScript
```bash
curl -X POST https://api.telegram.org/bot{TOKEN}/setWebhook \
  -d url=https://your-ts-app.com/api/webhook/telegram
```

### Java
```bash
curl -X POST https://api.telegram.org/bot{TOKEN}/setWebhook \
  -d url=https://your-java-app.com/api/webhook/telegram
```

## 🆚 Side-by-Side Commands

| Task | TypeScript | Java |
|------|-----------|------|
| Install | `npm install` | `mvn clean install` |
| Build | `npm run build` | `mvn package` |
| Run | `npm run dev` | `java -jar *.jar` |
| Test | `npm test` | `mvn test` |
| Docker | `docker build .` | `docker build java-bot` |
| Port | 3000 (customizable) | 8080 (customizable) |
| DB | PostgreSQL | SQLite |

## 🎓 Learning Path

### For TypeScript Developers
```
TypeScript → Mastra docs → Inngest → Deploy
```

### For Java Developers
```
Java → Spring Boot docs → Hibernate → Deploy
```

## 💰 Cost Comparison

### TypeScript
- OpenAI API: $0.01-0.10 per request
- PostgreSQL: $15-100/month
- Hosting: $7-25/month
- **Total:** $22-125/month

### Java
- No API costs
- Hosting: $0-10/month (free tier available)
- **Total:** $0-10/month

## 🚀 Deployment Comparison

| Platform | TypeScript | Java |
|----------|-----------|------|
| Replit | ✅ Native | ⚠️ Works |
| Render | ✅ Best | ✅ Great |
| Railway | ✅ Great | ✅ Great |
| Heroku | ✅ Works | ✅ Works |
| Docker | ✅ Yes | ✅ Yes |
| Lambda | ❌ Hard | ✅ Possible |

## 🔧 Migration Checklist

### If Moving from TypeScript to Java

- [ ] Export notes from PostgreSQL
- [ ] Export filters from PostgreSQL
- [ ] Export warnings from PostgreSQL
- [ ] Create new SQLite database
- [ ] Import data to Java bot
- [ ] Update Telegram webhook
- [ ] Test all commands
- [ ] Update GitHub (archive TS version)
- [ ] Delete old bot webhook

### If Moving from Java to TypeScript

- [ ] Backup SQLite database
- [ ] Export all data to JSON
- [ ] Set up PostgreSQL
- [ ] Run TypeScript migrations
- [ ] Import data
- [ ] Update Telegram webhook
- [ ] Test all commands
- [ ] Delete old bot

## 📝 Configuration Files

### TypeScript
- `.env` - Environment variables
- `src/index.ts` - Main entry point
- `src/mastra/index.ts` - Mastra registration

### Java
- `application.yml` - Spring Boot config
- `src/main/java/com/p2abot/P2ABotApplication.java` - Main entry
- `pom.xml` - Dependencies

## 🆘 Troubleshooting Migration

### Different Commands?
- TypeScript has AI-powered responses
- Java has simpler, direct commands
- Map commands between versions manually

### Database Format?
- TypeScript: PostgreSQL (relational)
- Java: SQLite (embedded)
- Need custom export/import scripts

### Webhook Issues?
- Ensure new bot token is set
- Update webhook URL in Telegram
- Test with curl first

## 🎯 Recommendation

**Choose based on your priority:**

1. **Need AI responses** → TypeScript
2. **Want simplicity** → Java
3. **Learning Spring Boot** → Java
4. **Production scale** → TypeScript
5. **Free deployment** → Java
6. **Quick setup** → Java

---

**Pro Tip:** Try both locally, then choose the one that fits your workflow!

**Need help?** See [GETTING_STARTED.md](GETTING_STARTED.md)
