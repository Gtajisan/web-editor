# P2A-Bot v2 - Quick Start Guide

Get P2A-Bot v2 (Java GOAT Edition) running in 5 minutes!

## 🚀 5-Minute Setup

### Step 1: Prerequisites
```bash
# Check Java version (need 21+)
java -version

# Check Maven version (need 3.8+)
mvn -version
```

### Step 2: Get Bot Token
1. Open Telegram → Search `@BotFather`
2. Send `/newbot` 
3. Follow the wizard
4. Copy the token (format: `123456789:ABCDefGhIjKlmNoPqRsTuVwXyZ`)

### Step 3: Build & Run
```bash
cd java-bot

# Set token
export TELEGRAM_BOT_TOKEN="paste_your_token_here"

# Build
mvn clean package

# Run
java -jar target/p2a-bot-java-2.0.0.jar
```

### Step 4: Test
1. Find your bot on Telegram
2. Send `/help`
3. Bot responds! ✅

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome message |
| `/help` | Show all commands |
| `/stats` | View chat statistics |
| `/ban <user_id>` | Ban user |
| `/kick <user_id>` | Kick user |
| `/note save <key> <content>` | Save note |
| `/note get <key>` | Get note |
| `/note list` | List notes |
| `/note delete <key>` | Delete note |

## 🐳 Docker (1 command)

```bash
docker build -t p2a-bot-java .
docker run -e TELEGRAM_BOT_TOKEN="your_token" -p 8080:8080 p2a-bot-java
```

## 🌐 Deploy to Render

1. Push to GitHub
2. Create Web Service on Render
3. Connect repo
4. Set env var: `TELEGRAM_BOT_TOKEN=your_token`
5. Deploy!

## 📊 API Endpoints

```bash
# Health check
curl http://localhost:8080/api/health

# Bot info
curl http://localhost:8080/api/health/info

# Chat stats
curl http://localhost:8080/api/stats/12345

# Webhook (Telegram sends here)
POST http://localhost:8080/api/webhook/telegram
```

## 🎯 Project Structure

```
├── command/          # Bot commands
├── service/          # Business logic
├── model/            # Database models
├── repository/       # Data access
├── controller/       # API endpoints
├── webhook/          # Telegram webhook
└── config/           # Configuration
```

## 🔧 Customize

Edit `src/main/resources/application.yml`:
```yaml
telegram:
  bot:
    token: ${TELEGRAM_BOT_TOKEN}
    username: p2abot        # Change bot username here

server:
  port: 8080               # Change port here
```

## ❓ FAQ

**Q: Bot doesn't respond?**  
A: Check token, restart app, verify webhook URL

**Q: Port 8080 already in use?**  
A: Change port in `application.yml` or `--server.port=8081`

**Q: How to add new command?**  
A: 1. Create class implementing `Command` interface  
2. Add `@Component` annotation  
3. Register in `CommandHandler`

**Q: Database file location?**  
A: SQLite creates `p2a-bot-data.db` in app directory

## 📚 Full Documentation

- [README.md](README.md) - Complete documentation
- [SETUP.md](SETUP.md) - Detailed setup guide
- [STRUCTURE.md](STRUCTURE.md) - Architecture & code organization

## 🚀 Next Steps

1. ✅ Get bot running locally
2. 📝 Add more commands
3. 🌐 Deploy to cloud
4. 🔗 Set webhook in Telegram
5. 📊 Monitor with logs

## 💡 Pro Tips

- Check logs: `tail -f logs/*.log`
- Reset database: Delete `p2a-bot-data.db`
- Test webhook: `curl -X POST http://localhost:8080/api/webhook/telegram -H "Content-Type: application/json" -d '{"message":...}'`

---

**Ready?** Start with step 1 above! 🚀

Need help? Check [README.md](README.md) for full documentation.
