# P2A Bot v2 - Java Edition (GOAT Version)

A powerful Telegram group management bot written in Java using Spring Boot with SQLite database.

## Features

✨ **Core Features:**
- ✅ Lightweight SQLite database (no external DB needed)
- ✅ Group moderation (ban, kick, warn users)
- ✅ Message filtering and content management
- ✅ Note management system
- ✅ Statistics tracking
- ✅ Command-based interface
- ✅ REST API for management

## Quick Start

### Prerequisites
- Java 21+
- Maven 3.8+

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd java-bot
```

2. **Set environment variables**
```bash
export TELEGRAM_BOT_TOKEN="your-bot-token-here"
```

3. **Build the project**
```bash
mvn clean package
```

4. **Run the application**
```bash
java -jar target/p2a-bot-java-2.0.0.jar
```

The bot will start on `http://localhost:8080`

## Configuration

Edit `src/main/resources/application.yml` to customize:

```yaml
telegram:
  bot:
    token: ${TELEGRAM_BOT_TOKEN}  # Bot token from @BotFather
    username: goatbotv2             # Bot username

server:
  port: 8080                         # Server port
```

## API Endpoints

### Health Check
```bash
GET /api/health
```

### Get Chat Statistics
```bash
GET /api/stats/{chatId}
```

### Record Action
```bash
POST /api/stats/{chatId}/message
POST /api/stats/{chatId}/ban
POST /api/stats/{chatId}/kick
```

### Telegram Webhook
```bash
POST /api/webhook/telegram
```

## Bot Commands

### Moderation
- `/ban @user` - Ban a user from the group
- `/kick @user` - Kick a user from the group
- `/warn @user reason` - Warn a user
- `/delete` - Delete replied message
- `/pin` - Pin replied message

### Notes Management
- `/note save key content` - Save a note
- `/note get key` - Retrieve a note
- `/note list` - List all notes
- `/note delete key` - Delete a note

### Information
- `/stats` - Display chat statistics
- `/help` - Show command help
- `/start` - Start the bot

## Database

P2A Bot v2 uses SQLite for data storage. The database file (`bot_data.db`) is created automatically in the application directory.

### Tables
- `telegram_chats` - Group information
- `bot_notes` - Saved notes
- `bot_filters` - Message filters
- `bot_warnings` - User warnings
- `bot_stats` - Chat statistics

## Deployment

### Docker
```bash
# Build Docker image
docker build -t p2a-bot-java .

# Run container
docker run -e TELEGRAM_BOT_TOKEN=your_token -p 8080:8080 p2a-bot-java
```

### Heroku
```bash
heroku create p2a-bot-java
heroku config:set TELEGRAM_BOT_TOKEN=your_token
git push heroku main
```

### Render
1. Create new Web Service on Render
2. Connect GitHub repository
3. Set environment variable `TELEGRAM_BOT_TOKEN`
4. Deploy

## Development

### Build for Development
```bash
mvn clean install
mvn spring-boot:run
```

### Run Tests
```bash
mvn test
```

### Code Structure
```
src/main/java/com/p2abot/
├── controller/       # REST API endpoints
├── model/           # Entity classes
├── repository/      # Data access layer
├── service/         # Business logic
├── webhook/         # Webhook handlers
└── P2ABotApplication.java  # Main entry point
```

## Logging

The bot uses SLF4J with Logback. View logs in console output:

```
2024-11-25 12:34:56 - com.p2abot.service.BotNoteService - 💾 [BotNoteService] Saving note...
```

## Troubleshooting

### Bot doesn't respond
1. Check `TELEGRAM_BOT_TOKEN` is set correctly
2. Verify Telegram webhook URL is accessible
3. Check logs for errors: `docker logs p2a-bot-java`

### Database errors
- Delete `bot_data.db` to reset the database
- SQLite will recreate tables automatically

### Port already in use
```bash
# Change port in application.yml or use:
java -jar target/p2a-bot-java-2.0.0.jar --server.port=8081
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use for personal or commercial projects

## Support

- 🐛 Report bugs on GitHub Issues
- 💬 Discussions for questions
- 📧 Email: support@p2abot.dev

## Credits

Developed by: **Gtajisan**  
Version: **2.0.0** (Java GOAT Edition)  
Built with: Spring Boot, Telegram Bot API, SQLite
