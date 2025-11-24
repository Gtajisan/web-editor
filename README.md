# 🤖 P2A-Bot - Advanced Telegram Group Management Bot

**Developer:** Gtajisan

P2A-Bot is a powerful, AI-powered Telegram group management bot inspired by Rose-Bot, built with TypeScript, Mastra Framework, and OpenAI GPT-4. It provides comprehensive moderation tools, automated responses, user management, and intelligent conversation handling.

---

## ✨ Features

### 🛡️ **Moderation & Administration**
- **Ban/Kick Users** - Remove problematic users from your group
- **Mute/Unmute** - Restrict or restore user messaging permissions
- **Warning System** - Track user violations with automatic warnings
- **Message Management** - Delete, pin, and manage group messages
- **User Info** - Get detailed information about group members

### 📝 **Smart Content Management**
- **Notes System** - Save and retrieve important information
- **Auto-Filters** - Create automatic responses to keywords
- **Custom Rules** - Set and display group rules
- **Welcome/Goodbye Messages** - Greet new members and say goodbye

### 📊 **Analytics & Monitoring**
- **Web Dashboard** - Beautiful real-time statistics dashboard
- **Usage Statistics** - Track messages, commands, and user activity
- **Activity Logs** - Monitor all bot actions and events
- **Chat Analytics** - Per-chat statistics and insights

### 🤖 **AI-Powered Intelligence**
- **Natural Language Processing** - Understands context and intent
- **Conversation Memory** - Remembers previous interactions
- **Smart Command Parsing** - Flexible command syntax
- **Helpful Responses** - Provides detailed, educational feedback

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- OpenAI API Key (from [OpenAI Platform](https://platform.openai.com/api-keys))
- PostgreSQL database (provided by default in Replit)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Gtajisan/p2a-bot.git
   cd p2a-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file or set the following environment variables:
   ```env
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
   OPENAI_API_KEY=your_openai_api_key_here
   DATABASE_URL=your_postgresql_database_url
   ```

4. **Initialize the database:**
   
   The bot automatically creates required database tables on first run.

5. **Start the bot:**
   ```bash
   npm run dev
   ```

6. **Set up the Telegram webhook:**
   
   Set your bot's webhook to point to your deployed server:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_DEPLOY_URL>/webhooks/telegram/action
   ```

---

## 📋 Available Commands

### Admin Commands
| Command | Description | Usage |
|---------|-------------|-------|
| `/ban` | Permanently ban a user | `/ban @username [reason]` |
| `/kick` | Remove user (can rejoin) | `/kick @username` |
| `/mute` | Restrict user messages | `/mute @username [duration]` |
| `/unmute` | Remove restrictions | `/unmute @username` |
| `/warn` | Issue a warning | `/warn @username [reason]` |
| `/pin` | Pin a message | Reply to message + `/pin` |
| `/del` | Delete a message | Reply to message + `/del` |

### Information Commands
| Command | Description | Usage |
|---------|-------------|-------|
| `/info` | Get user information | `/info @username` |
| `/chatinfo` | Get chat details | `/chatinfo` |
| `/stats` | Show group statistics | `/stats` |
| `/help` | Show help message | `/help` |
| `/start` | Start the bot | `/start` |

### Notes & Filters
| Command | Description | Usage |
|---------|-------------|-------|
| `/save` | Save a note | `/save notename content here` |
| `/get` | Retrieve a note | `/get notename` |
| `/notes` | List all notes | `/notes` |
| `/clear` | Delete a note | `/clear notename` |
| `/filter` | Create auto-response | `/filter keyword response` |
| `/filters` | List all filters | `/filters` |
| `/stop` | Remove a filter | `/stop keyword` |

### Settings
| Command | Description | Usage |
|---------|-------------|-------|
| `/welcome` | Set welcome message | `/welcome Welcome {user}!` |
| `/goodbye` | Set goodbye message | `/goodbye Goodbye {user}!` |
| `/rules` | Display group rules | `/rules` |
| `/setrules` | Set group rules | `/setrules 1. Rule one\n2. Rule two` |
| `/settings` | View bot settings | `/settings` |

---

## 🌐 Web Dashboard

Access the beautiful web dashboard at your deployment URL (e.g., `https://your-app.replit.app/`)

### Dashboard Features:
- 📊 Real-time statistics
- 🔍 Bot status monitoring
- 📈 Activity graphs
- 💬 Message analytics
- 👥 User counts
- ⚙️ Bot information

---

## 🚢 Deployment

### Deploy on Render (Free)

1. **Create a new Web Service** on [Render](https://render.com/)

2. **Connect your GitHub repository**

3. **Configure the service:**
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. **Add environment variables:**
   - `TELEGRAM_BOT_TOKEN`
   - `OPENAI_API_KEY`
   - `DATABASE_URL` (use Render's PostgreSQL add-on)
   - `NODE_ENV=production`

5. **Deploy** and copy your service URL

6. **Set the webhook:**
   ```bash
   curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_RENDER_URL>/webhooks/telegram/action
   ```

### Deploy on Railway

1. **Create a new project** on [Railway](https://railway.app/)

2. **Deploy from GitHub**

3. **Add environment variables** in the Variables tab

4. **Add PostgreSQL database** from Railway's service catalog

5. **Set the webhook** using your Railway deployment URL

### Deploy on Heroku

1. **Create a new app** on [Heroku](https://heroku.com/)

2. **Add Heroku Postgres add-on**

3. **Configure environment variables** in Settings → Config Vars

4. **Deploy** via GitHub or Heroku CLI:
   ```bash
   heroku git:remote -a your-app-name
   git push heroku main
   ```

5. **Set the webhook** using your Heroku app URL

### Deploy on Replit

1. **Fork this Repl** or import from GitHub

2. **Add Secrets** in the Secrets tab:
   - `TELEGRAM_BOT_TOKEN`
   - `OPENAI_API_KEY`

3. **Click "Run"** to start the bot

4. **Get your Replit URL** and set the webhook

---

## 🏗️ Project Structure

```
p2a-bot/
├── src/
│   ├── mastra/
│   │   ├── agents/
│   │   │   └── p2aBotAgent.ts       # Main bot agent
│   │   ├── tools/
│   │   │   ├── telegramTools.ts     # Telegram API tools
│   │   │   └── advancedBotTools.ts  # Database tools
│   │   ├── workflows/
│   │   │   └── p2aBotWorkflow.ts    # Message processing workflow
│   │   ├── storage/
│   │   │   └── botDatabase.ts       # Database operations
│   │   └── index.ts                 # Mastra configuration
│   ├── triggers/
│   │   └── telegramTriggers.ts      # Webhook handler
│   └── global.d.ts
├── public/
│   └── dashboard.html               # Web dashboard
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔧 Configuration

### Database Schema

The bot automatically creates these tables:
- `bot_notes` - Saved notes per chat
- `bot_filters` - Auto-response filters
- `bot_warnings` - User warnings tracker
- `bot_settings` - Chat-specific settings
- `bot_stats` - Usage statistics

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | ✅ Yes | Bot token from @BotFather |
| `OPENAI_API_KEY` | ✅ Yes | OpenAI API key for AI features |
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `NODE_ENV` | ❌ No | Set to `production` for production |

---

## 🧪 Testing

### Test the bot locally:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Use ngrok or similar to expose localhost:**
   ```bash
   ngrok http 5000
   ```

3. **Set the webhook to your ngrok URL:**
   ```bash
   curl https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-ngrok-url.ngrok.io/webhooks/telegram/action
   ```

4. **Send a message to your bot on Telegram**

### Test specific commands:

```bash
# In Telegram, send:
/start
/help
/save test This is a test note
/get test
/notes
```

---

## 🛠️ Development

### Adding new commands:

1. **Create a new tool** in `src/mastra/tools/`
2. **Add the tool to the agent** in `src/mastra/agents/p2aBotAgent.ts`
3. **Update the agent instructions** with the new command
4. **Test the command**

### Example: Adding a custom command

```typescript
// In src/mastra/tools/customTools.ts
export const customTool = createTool({
  id: "custom-tool",
  description: "Does something custom",
  inputSchema: z.object({
    param: z.string().describe("Parameter description"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [customTool] Starting execution");
    
    // Your custom logic here
    
    return {
      success: true,
      message: "Command executed successfully!",
    };
  },
});
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Developer

**Gtajisan**

- GitHub: [@Gtajisan](https://github.com/Gtajisan)

---

## 🙏 Acknowledgments

- Inspired by [Rose-Bot](https://github.com/MRK-YT/Rose-Bot)
- Built with [Mastra Framework](https://mastra.ai/)
- Powered by [OpenAI GPT-4](https://openai.com/)
- Telegram Bot API by [Telegraf](https://telegraf.js.org/)

---

## 📞 Support

For questions, issues, or feature requests:

1. Open an issue on GitHub
2. Contact the developer on Telegram
3. Check the [documentation](https://github.com/Gtajisan/p2a-bot/wiki)

---

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Custom plugin system
- [ ] Voice command support
- [ ] Integration with more services
- [ ] Mobile app for bot management

---

**Made with ❤️ by Gtajisan**
