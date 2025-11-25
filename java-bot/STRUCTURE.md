# P2A-Bot v2 - GOAT Edition (Java) Structure

Complete folder and file organization for the P2A-Bot Java implementation.

## 📁 Directory Structure

```
java-bot/
├── src/
│   ├── main/
│   │   ├── java/com/p2abot/
│   │   │   ├── P2ABotApplication.java          # Main entry point
│   │   │   ├── command/
│   │   │   │   ├── Command.java                # Command interface
│   │   │   │   ├── CommandRegistry.java        # Command registration
│   │   │   │   ├── CommandHandler.java         # Command dispatcher
│   │   │   │   └── impl/
│   │   │   │       ├── StartCommand.java       # /start command
│   │   │   │       ├── HelpCommand.java        # /help command
│   │   │   │       ├── StatsCommand.java       # /stats command
│   │   │   │       ├── BanCommand.java         # /ban command
│   │   │   │       ├── KickCommand.java        # /kick command
│   │   │   │       └── NoteCommand.java        # /note command
│   │   │   ├── config/
│   │   │   │   └── AppConfig.java              # App configuration
│   │   │   ├── controller/
│   │   │   │   ├── HealthController.java       # Health check endpoints
│   │   │   │   └── StatsController.java        # Stats API endpoints
│   │   │   ├── model/
│   │   │   │   ├── TelegramChat.java           # Chat entity
│   │   │   │   ├── BotNote.java                # Note entity
│   │   │   │   ├── BotFilter.java              # Filter entity
│   │   │   │   ├── UserWarning.java            # Warning entity
│   │   │   │   └── BotStats.java               # Stats entity
│   │   │   ├── repository/
│   │   │   │   ├── BotNoteRepository.java      # Note repository
│   │   │   │   ├── BotFilterRepository.java    # Filter repository
│   │   │   │   ├── UserWarningRepository.java  # Warning repository
│   │   │   │   └── BotStatsRepository.java     # Stats repository
│   │   │   ├── service/
│   │   │   │   ├── BotNoteService.java         # Note service logic
│   │   │   │   ├── BotFilterService.java       # Filter service logic
│   │   │   │   ├── UserWarningService.java     # Warning service logic
│   │   │   │   ├── BotStatsService.java        # Stats service logic
│   │   │   │   └── TelegramBotService.java     # Telegram API service
│   │   │   └── webhook/
│   │   │       └── TelegramWebhookController.java  # Webhook handler
│   │   └── resources/
│   │       └── application.yml                 # Spring config
│   └── test/java/
├── pom.xml                                     # Maven configuration
├── Dockerfile                                  # Docker build file
├── .gitignore                                  # Git ignore rules
├── README.md                                   # Full documentation
├── SETUP.md                                    # Setup guide
└── STRUCTURE.md                                # This file
```

## 🔌 Architecture Layers

### 1. **Entry Point**
- `P2ABotApplication.java` - Main Spring Boot application

### 2. **Webhook Layer**
- `TelegramWebhookController` - Receives Telegram messages via webhook
- Validates and routes messages

### 3. **Command Layer**
- `Command` interface - Abstract command definition
- `CommandRegistry` - Registers and manages commands
- `CommandHandler` - Dispatches commands to handlers
- `impl/*` - Concrete command implementations

### 4. **Service Layer**
- `TelegramBotService` - Telegram API integration
- `BotNoteService` - Note operations
- `BotFilterService` - Filter operations
- `UserWarningService` - Warning management
- `BotStatsService` - Statistics tracking

### 5. **Repository Layer**
- Data access objects (DAOs)
- Direct database communication
- JPA repositories

### 6. **Model Layer**
- JPA entities
- Database table mappings

### 7. **API Layer**
- `HealthController` - Health checks and info
- `StatsController` - Statistics endpoints

## 🔄 Data Flow

```
Telegram Update
    ↓
[TelegramWebhookController]
    ↓
Extract Message/Command
    ↓
Check if Command
    ├─ YES → [CommandHandler]
    │         ↓
    │    [CommandRegistry]
    │         ↓
    │    [Specific Command]
    │         ↓
    │    [Service Layer]
    │         ↓
    │    [Repository Layer]
    │         ↓
    │    Database/Telegram API
    │
    └─ NO → [BotFilterService]
            ↓
        Apply Filters
            ↓
        [TelegramBotService]
            ↓
        Send Response
```

## 📊 Database Schema

### Entities
1. **TelegramChat** - Group/chat configuration
2. **BotNote** - Saved notes (UUID key)
3. **BotFilter** - Content filters
4. **UserWarning** - User warnings
5. **BotStats** - Chat statistics

## 🚀 Key Features

### Command System
- Extensible command architecture
- Easy to add new commands
- Centralized command registration
- Error handling per command

### Service Pattern
- Business logic separation
- Service-to-service communication
- Reusable across controllers/commands

### Repository Pattern
- Data abstraction
- Easy testing
- JPA integration

## 📝 Adding New Commands

### 1. Create Command Class
```java
@Component
@RequiredArgsConstructor
public class MyCommand implements Command {
    @Override
    public String getCommand() { return "/mycommand"; }
    
    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        // Implementation
    }
}
```

### 2. Register in CommandHandler
```java
registry.register(myCommand);
```

## 🔌 Configuration

Edit `application.yml` to modify:
- Telegram bot token
- Bot username
- Database settings
- Server port
- Logging levels

## 📦 Dependencies

- **Spring Boot 3.2** - Web framework
- **Hibernate** - ORM
- **SQLite** - Database
- **TelegramBots** - Telegram API
- **Lombok** - Code generation
- **Jackson** - JSON processing
- **SLF4J + Logback** - Logging

## 🧪 Testing

Run tests with:
```bash
mvn test
```

## 🐳 Docker Deployment

Build:
```bash
docker build -t p2a-bot-java .
```

Run:
```bash
docker run -e TELEGRAM_BOT_TOKEN=token -p 8080:8080 p2a-bot-java
```

## 📊 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Health check |
| GET | `/health/info` | Bot information |
| GET | `/stats/{chatId}` | Get chat stats |
| POST | `/webhook/telegram` | Telegram webhook |

## 🔒 Security Notes

- No secrets in code
- Environment variables for sensitive data
- Input validation on all commands
- Error handling without exposing internals

## 🚀 Performance Tips

1. Commands are stateless
2. Service layer caches data efficiently
3. Repository layer uses indexes
4. Async processing support via Spring

## 📚 Code Conventions

- Package structure by feature
- Clear class naming
- Comprehensive logging
- Comments for complex logic
- JavaDoc for public APIs

## 🎯 Future Extensions

- Command permissions system
- Scheduled tasks (Inngest integration)
- Advanced filtering rules
- User reputation system
- Multi-language support

---

**Version:** 2.0.0  
**Developer:** Gtajisan  
**License:** MIT
