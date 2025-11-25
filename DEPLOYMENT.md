# P2A-Bot v2 - Deployment Guide

Complete step-by-step guide for deploying P2A-Bot to production. Choose your platform below - Render is recommended for easiest setup.

## 🚀 Deployment Options Comparison

| Platform | Cost | Setup | Best For | Status |
|----------|------|-------|----------|--------|
| **Render.com** | Free tier | 5 min | Both versions | ✅ Recommended |
| **Railway.app** | Free tier | 5 min | Both versions | ✅ Great |
| **Heroku** | $7/month | 10 min | Both versions | ⚠️ Paid |
| **Replit** | Free | 2 min | TypeScript | ✅ Native |
| **Docker** | Self-hosted | 15 min | Both versions | ✅ Full control |
| **AWS Lambda** | Pay-per-use | 30 min | Java only | ⚠️ Complex |

---

## 🎯 Render.com (Recommended)

### TypeScript Version

**Step 1: Prepare Repository**
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

**Step 2: Create Service on Render**
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Select root directory `/`
5. Set Build Command: `npm install && npm run build`
6. Set Start Command: `npm start`

**Step 3: Set Environment Variables**
```
TELEGRAM_BOT_TOKEN=your_token_here
DATABASE_URL=your_postgres_connection_string
OPENAI_API_KEY=your_openai_key
```

**Step 4: Deploy**
- Click "Create Web Service"
- Wait for deployment (~5 minutes)

### Java Version

**Step 1: Prepare Java Project**
```bash
cd java-bot
git add .
git commit -m "Add Java bot"
git push origin main
```

**Step 2: Create Service on Render**
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repo
4. Set Root Directory: `java-bot`
5. Set Build Command: `mvn clean package -DskipTests`
6. Set Start Command: `java -jar target/p2a-bot-java-2.0.0.jar`

**Step 3: Set Environment**
```
TELEGRAM_BOT_TOKEN=your_token_here
```

**Step 4: Deploy**
- Click "Create Web Service"
- Wait for deployment (~3 minutes)

---

## 🚂 Railway.app

### TypeScript Version

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Create environment
railway env add TELEGRAM_BOT_TOKEN your_token
railway env add DATABASE_URL your_db_url
railway env add OPENAI_API_KEY your_key

# Deploy
railway up
```

### Java Version

```bash
# From java-bot directory
cd java-bot

# Initialize
railway init

# Set environment
railway env add TELEGRAM_BOT_TOKEN your_token

# Deploy
railway up
```

---

## 🐳 Docker Deployment

### Build Docker Images

**TypeScript**
```bash
docker build -t p2a-bot:latest .
docker tag p2a-bot:latest your-registry/p2a-bot:latest
docker push your-registry/p2a-bot:latest
```

**Java**
```bash
cd java-bot
docker build -t p2a-bot-java:latest .
docker tag p2a-bot-java:latest your-registry/p2a-bot-java:latest
docker push your-registry/p2a-bot-java:latest
```

### Run Locally

**TypeScript**
```bash
docker run -e TELEGRAM_BOT_TOKEN=token \
           -e DATABASE_URL=your_db_url \
           -p 5000:5000 \
           p2a-bot:latest
```

**Java**
```bash
docker run -e TELEGRAM_BOT_TOKEN=token \
           -p 8080:8080 \
           -v p2a-bot-data:/app/data \
           p2a-bot-java:latest
```

### Docker Compose

```yaml
version: '3.8'

services:
  typescript-bot:
    image: p2a-bot:latest
    environment:
      TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN}
      DATABASE_URL: ${DATABASE_URL}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    ports:
      - "5000:5000"

  java-bot:
    image: p2a-bot-java:latest
    environment:
      TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN}
    ports:
      - "8080:8080"
    volumes:
      - p2a-bot-data:/app/data

volumes:
  p2a-bot-data:
```

---

## ☁️ Heroku Deployment

### TypeScript

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create p2a-bot-ts

# Set buildpack
heroku buildpacks:set heroku/nodejs

# Set environment
heroku config:set TELEGRAM_BOT_TOKEN=your_token
heroku config:set DATABASE_URL=your_db_url
heroku config:set OPENAI_API_KEY=your_key

# Deploy
git push heroku main
```

### Java

```bash
# Create app
heroku create p2a-bot-java

# Set buildpack
heroku buildpacks:set heroku/java

# Set environment
heroku config:set TELEGRAM_BOT_TOKEN=your_token

# Deploy
git push heroku main
```

---

## 📋 Post-Deployment Checklist

### 1. Verify Deployment
```bash
# TypeScript
curl https://your-app.herokuapp.com/api/health

# Java
curl https://your-app.herokuapp.com/api/health/info
```

### 2. Set Telegram Webhook
```bash
curl -X POST https://api.telegram.org/bot{TOKEN}/setWebhook \
  -H "Content-Type: application/json" \
  -d '{"url":"https://your-app-url/api/webhook/telegram"}'
```

### 3. Verify Webhook
```bash
curl https://api.telegram.org/bot{TOKEN}/getWebhookInfo
```

### 4. Test Bot
1. Send `/start` to bot
2. Bot should respond with welcome message
3. Send `/help` to see commands

### 5. Monitor Logs
```bash
# Heroku
heroku logs --tail

# Render
# View in dashboard

# Docker
docker logs -f container_id
```

---

## 🔄 Continuous Deployment

### GitHub Actions (TypeScript)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }} \
            -H "Content-Type: application/json"
```

### GitHub Actions (Java)

```yaml
name: Deploy Java Bot

on:
  push:
    paths:
      - 'java-bot/**'
      
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-java@v2
        with:
          java-version: '21'
      - name: Build
        run: cd java-bot && mvn package
      - name: Deploy
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## 📊 Monitoring & Maintenance

### Health Checks

**TypeScript**
```bash
# Every 5 minutes
curl -f http://localhost:5000/api/health || alert
```

**Java**
```bash
# Every 5 minutes
curl -f http://localhost:8080/api/health || alert
```

### Logs Analysis

**TypeScript - Look for:**
- Agent errors
- Workflow failures
- Database connection issues

**Java - Look for:**
- Command execution errors
- Service exceptions
- Database initialization

### Restart Procedures

**TypeScript**
```bash
# Render
# Auto-restart on deployment

# Local
npm run dev
```

**Java**
```bash
# Render
# Auto-restart on deployment

# Local
./run.sh
```

---

## 🔐 Security Deployment

### Environment Variables
- Never commit secrets to git
- Use `.env.local` for local development
- Use platform secrets management (Render, Heroku)

### Database Security
- Use strong passwords (PostgreSQL)
- Enable SSL connections
- Backup regularly

### API Security
- Monitor access logs
- Rate limit endpoints
- Use HTTPS only

---

## 💰 Cost Estimation

### Monthly Costs

**TypeScript (with AI):**
- Render Web Service: $0-7 (free tier)
- PostgreSQL: $15-100
- OpenAI API: $0-100
- **Total: $15-207/month**

**Java (No AI):**
- Render Web Service: $0-7 (free tier)
- SQLite: $0 (embedded)
- **Total: $0-7/month**

---

## 🆘 Deployment Troubleshooting

| Issue | Solution |
|-------|----------|
| Deployment fails | Check build logs, verify dependencies |
| Bot doesn't respond | Verify webhook URL, check logs |
| Database connection error | Verify DATABASE_URL format |
| Memory limit exceeded | Increase dyno size or optimize code |
| Logs not showing | Check platform logging settings |

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Heroku Documentation](https://devcenter.heroku.com)
- [Docker Documentation](https://docs.docker.com)

---

**Last Updated:** November 25, 2024  
**Deployment Version:** 2.0.0
