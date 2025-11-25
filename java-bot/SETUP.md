# P2A Bot v2 Java - Setup Guide

## Step 1: Get Telegram Bot Token

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` and follow instructions
3. Copy the API token (format: `1234567890:ABCDefGhIjKlmNoPqRsTuVwXyZ`)

## Step 2: Prepare Your Machine

### Option A: Using Maven (Recommended)

```bash
# Check Java version (must be 21+)
java -version

# Check Maven version (must be 3.8+)
mvn -version
```

### Option B: Using Docker

```bash
# Install Docker from https://docker.com
docker --version
```

## Step 3: Deploy

### Local Development

```bash
cd java-bot

# Set bot token
export TELEGRAM_BOT_TOKEN="your_token_here"

# Build & Run
mvn clean package
java -jar target/p2a-bot-java-2.0.0.jar
```

Bot runs at: `http://localhost:8080`

### Docker Deployment

```bash
cd java-bot

# Build image
docker build -t p2a-bot-java .

# Run container
docker run -e TELEGRAM_BOT_TOKEN="your_token_here" -p 8080:8080 p2a-bot-java
```

### Cloud Deployment

#### Render.com (Free)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your GitHub repo
4. Set environment variable: `TELEGRAM_BOT_TOKEN`
5. Deploy!

#### Heroku (Requires Payment)
```bash
heroku create your-bot-name
heroku config:set TELEGRAM_BOT_TOKEN=your_token
git push heroku main
```

#### Railway.app
1. Connect GitHub
2. Add `TELEGRAM_BOT_TOKEN` environment variable
3. Deploy

## Step 4: Set Webhook

Get your deployment URL and set it in Telegram:

```bash
curl -X POST https://api.telegram.org/bot{BOT_TOKEN}/setWebhook \
  -H "Content-Type: application/json" \
  -d '{"url":"https://your-app-url/api/webhook/telegram"}'
```

## Step 5: Test the Bot

1. Find your bot on Telegram (search by username)
2. Send `/help` command
3. Check response

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `java: command not found` | Install Java 21+ from https://adoptium.net |
| `mvn: command not found` | Install Maven from https://maven.apache.org |
| Bot doesn't respond | Check webhook URL is accessible |
| Port 8080 already in use | Change port: `--server.port=8081` |
| Database locked | Delete `bot_data.db` and restart |

## Next Steps

- 📖 Read [README.md](README.md) for full documentation
- 🛠️ Customize bot responses in `TelegramWebhookController.java`
- 📊 Add more features to services
- 🚀 Deploy to production

## Support

- GitHub Issues for bugs
- Check logs: `docker logs p2a-bot-java`
- Visit: https://telegram.org/blog/bot-revolution
