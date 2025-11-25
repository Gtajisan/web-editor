# P2A-Bot v2 - Create Your Own Commands Guide

Complete guide to creating custom commands for P2A-Bot (GOAT Bot Style)

---

## 🎯 Understanding the Command System

### How Commands Work
```
1. User sends /mycommand in Telegram
2. Webhook receives message
3. CommandHandler routes to appropriate command
4. Command executes with context
5. Response sent back to Telegram
```

### Command Flow
```
TelegramWebhookController
    ↓
CommandHandler.handleCommand()
    ↓
CommandRegistry.getCommand()
    ↓
YourCustomCommand.execute()
    ↓
Response sent to chat
```

---

## 📝 Step 1: Create Command Class

### Location
```
java-bot/src/main/java/com/p2abot/command/impl/YourCommandName.java
```

### Basic Template
```java
package com.p2abot.command.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.p2abot.command.Command;
import com.p2abot.service.TelegramBotService;
import com.p2abot.security.PermissionChecker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class YourCommandName implements Command {
    private final TelegramBotService botService;
    private final PermissionChecker permissionChecker;

    @Override
    public String getCommand() {
        return "/yourcommand";
    }

    @Override
    public String getDescription() {
        return "Brief description of what command does";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("🔧 [YourCommandName] Executing command");
        
        // Your logic here
        String response = "Command executed!";
        
        botService.sendMessage(chatId, response, null);
    }
}
```

---

## 📋 Step 2: Implement Command Interface

### Required Methods

**1. getCommand()**
```java
@Override
public String getCommand() {
    return "/mycommand";  // Must start with /
}
```

**2. getDescription()**
```java
@Override
public String getDescription() {
    return "Does something awesome";
}
```

**3. execute()**
```java
@Override
public void execute(Long chatId, Long userId, String args, JsonNode message) {
    // Implementation
}
```

### Parameters Explained

```
chatId    - Telegram chat/group ID where command was sent
userId    - Telegram user ID who sent command
args      - Arguments after command (e.g., "/ban @user reason" → args = "@user reason")
message   - Full Telegram message JSON for context
```

---

## 🔒 Step 3: Add Permission Checks

### Check if Admin (Group Only)
```java
if (permissionChecker.isGroupChat(message) && 
    !permissionChecker.isAdmin(message, userId)) {
    botService.sendMessage(chatId, "❌ Admin only", null);
    return;
}
```

### Check Chat Type
```java
// Only in DM
if (!permissionChecker.isPrivateChat(message)) {
    botService.sendMessage(chatId, "Use in DM only", null);
    return;
}

// Only in Group
if (!permissionChecker.isGroupChat(message)) {
    botService.sendMessage(chatId, "Use in group only", null);
    return;
}
```

### Get User/Chat Info
```java
Long userId = permissionChecker.getFromUserId(message);
Long chatId = permissionChecker.getChatId(message);
String chatType = permissionChecker.getChatType(message);
```

---

## 💾 Step 4: Use Database Services

### Inject Services
```java
@RequiredArgsConstructor
public class YourCommandName implements Command {
    private final TelegramBotService botService;
    private final GroupSettingsService groupSettingsService;
    private final AutomationService automationService;
    private final UserWarningService warningService;
    // ... more services
}
```

### Access Group Settings
```java
var settings = groupSettingsService.getOrCreateSettings(chatId);
if (settings.getAntiFloodEnabled()) {
    // Do something
}
```

### Update Group Rules
```java
groupSettingsService.updateSetting(chatId, "antiflood", true);
```

### Access User Rules
```java
var rules = userRulesRepository.findByChatIdAndUserId(chatId, userId);
if (rules.isPresent() && rules.get().isBanned()) {
    botService.sendMessage(chatId, "User is banned", null);
}
```

---

## 📨 Step 5: Send Messages

### Simple Message
```java
botService.sendMessage(chatId, "Hello world!", null);
```

### Formatted Message (Markdown)
```java
String msg = "**Bold text**\n" +
             "_Italic text_\n" +
             "`Code text`";
botService.sendMessage(chatId, msg, null);
```

### With Buttons
```java
String buttons = "[Button1](https://example.com)";
botService.sendMessage(chatId, msg, buttons);
```

### Parse Arguments
```java
String[] parts = args.split(" ");
if (parts.length < 1) {
    botService.sendMessage(chatId, "Usage: /mycommand <arg1> <arg2>", null);
    return;
}
```

---

## 🎯 Complete Example: Custom Greeting Command

### Step 1: Create File
```
java-bot/src/main/java/com/p2abot/command/impl/GreetCommand.java
```

### Step 2: Implement Command
```java
package com.p2abot.command.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.p2abot.command.Command;
import com.p2abot.service.TelegramBotService;
import com.p2abot.security.PermissionChecker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class GreetCommand implements Command {
    private final TelegramBotService botService;
    private final PermissionChecker permissionChecker;

    @Override
    public String getCommand() {
        return "/greet";
    }

    @Override
    public String getDescription() {
        return "Send a custom greeting message";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("👋 [GreetCommand] Greeting user");
        
        // Get user info from message
        JsonNode from = message.get("from");
        String username = from.has("first_name") ? 
            from.get("first_name").asText() : "Friend";
        
        // Build greeting
        String response = String.format(
            "👋 **Hello %s!**\n\n" +
            "Welcome to P2A-Bot v2\n" +
            "Type /help to see all commands",
            username
        );
        
        botService.sendMessage(chatId, response, null);
        log.info("✅ Greeted user: {}", username);
    }
}
```

### Step 3: Register Command

In `CommandHandler.java`:
```java
@Component
@RequiredArgsConstructor
public class CommandHandler {
    private final GreetCommand greetCommand;  // Add this
    
    public void init() {
        // ... existing registrations
        registry.register(greetCommand);  // Add this
    }
}
```

---

## 🔄 Advanced Example: Database-backed Command

### Create Database Models (if needed)
```java
@Entity
@Table(name = "my_data")
@Data
public class MyData {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private Long chatId;
    private Long userId;
    private String customData;
    private LocalDateTime createdAt;
}
```

### Create Repository
```java
@Repository
public interface MyDataRepository extends JpaRepository<MyData, String> {
    Optional<MyData> findByChatIdAndUserId(Long chatId, Long userId);
}
```

### Use in Command
```java
@Slf4j
@Component
@RequiredArgsConstructor
public class MyCustomCommand implements Command {
    private final TelegramBotService botService;
    private final MyDataRepository dataRepository;

    @Override
    public String getCommand() {
        return "/mycustom";
    }

    @Override
    public String getDescription() {
        return "My custom command with database";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("🔧 [MyCustomCommand] Executing");
        
        // Save to database
        var data = dataRepository.findByChatIdAndUserId(chatId, userId)
            .orElse(new MyData());
        data.setChatId(chatId);
        data.setUserId(userId);
        data.setCustomData(args);
        data.setCreatedAt(LocalDateTime.now());
        dataRepository.save(data);
        
        botService.sendMessage(chatId, "✅ Data saved", null);
    }
}
```

---

## 🎮 Usage Pattern Examples

### Pattern 1: Simple Action
```java
// /hello
@Override
public void execute(Long chatId, Long userId, String args, JsonNode message) {
    botService.sendMessage(chatId, "Hello! 👋", null);
}
```

### Pattern 2: With Arguments
```java
// /greet @user message
@Override
public void execute(Long chatId, Long userId, String args, JsonNode message) {
    String[] parts = args.split(" ", 2);
    if (parts.length < 2) {
        botService.sendMessage(chatId, "Usage: /greet @user <message>", null);
        return;
    }
    String user = parts[0];
    String text = parts[1];
    botService.sendMessage(chatId, user + " " + text, null);
}
```

### Pattern 3: Admin Only
```java
// /admincmd
@Override
public void execute(Long chatId, Long userId, String args, JsonNode message) {
    if (!permissionChecker.isAdmin(message, userId)) {
        botService.sendMessage(chatId, "❌ Admins only", null);
        return;
    }
    botService.sendMessage(chatId, "Admin command executed", null);
}
```

### Pattern 4: Conditional Logic
```java
// /check
@Override
public void execute(Long chatId, Long userId, String args, JsonNode message) {
    if (permissionChecker.isGroupChat(message)) {
        botService.sendMessage(chatId, "Group chat detected", null);
    } else if (permissionChecker.isPrivateChat(message)) {
        botService.sendMessage(chatId, "Private chat detected", null);
    }
}
```

### Pattern 5: Database Storage
```java
// /store <key> <value>
@Override
public void execute(Long chatId, Long userId, String args, JsonNode message) {
    String[] parts = args.split(" ", 2);
    if (parts.length < 2) return;
    
    var data = new MyData();
    data.setChatId(chatId);
    data.setUserId(userId);
    data.setKey(parts[0]);
    data.setValue(parts[1]);
    repository.save(data);
    
    botService.sendMessage(chatId, "✅ Stored", null);
}
```

---

## 📊 Testing Your Command

### Compile
```bash
cd java-bot
mvn compile
```

### Build
```bash
mvn package -DskipTests
```

### Test in Telegram
1. Send `/help` → Your command should appear
2. Send `/yourcommand` → Should execute
3. Check console logs for debug output

### Check Logs
```bash
tail -f logs/p2a-bot.log | grep YourCommandName
```

---

## 🎨 Available Services to Inject

### TelegramBotService
```java
botService.sendMessage(chatId, text, buttons);
botService.deleteMessage(chatId, messageId);
```

### PermissionChecker
```java
permissionChecker.isAdmin(message, userId);
permissionChecker.isGroupChat(message);
permissionChecker.isPrivateChat(message);
```

### GroupSettingsService
```java
groupSettingsService.getOrCreateSettings(chatId);
groupSettingsService.updateSetting(chatId, key, value);
groupSettingsService.setRules(chatId, rules);
```

### AutomationService
```java
automationService.handleAutoWarning(chatId, userId, settings);
automationService.checkAndEnforceMutes(chatId);
```

### Repositories
```java
userWarningRepository.findByChatIdAndUserId(chatId, userId);
botNoteRepository.findByChatId(chatId);
botFilterRepository.findAll();
```

---

## 🚀 Deployment Checklist

- ✅ Command class created and implements `Command`
- ✅ Annotated with `@Component` and `@Slf4j`
- ✅ Required services injected
- ✅ `execute()` method implemented
- ✅ Logging added throughout
- ✅ Command registered in `CommandHandler.init()`
- ✅ Compiled without errors
- ✅ Tested in Telegram

---

## 🎓 Key Concepts

### Command Interface
```java
public interface Command {
    String getCommand();
    String getDescription();
    void execute(Long chatId, Long userId, String args, JsonNode message);
}
```

### JsonNode (Message Object)
Access message data:
```java
message.get("from")          // Sender info
message.get("chat")          // Chat info
message.get("text")          // Message text
message.get("message_id")    // Message ID
message.get("reply_to_message") // Replied message
```

### Logging Pattern
```java
log.info("📊 [CommandName] User action");
log.debug("🔍 [CommandName] Debug info");
log.warn("⚠️ [CommandName] Warning");
log.error("❌ [CommandName] Error");
```

---

## 📚 Examples in Codebase

Study existing commands for reference:
- Simple: `StartCommand.java`
- With args: `BanCommand.java`
- Database: `NoteCommand.java`
- Admin check: `SettingsCommand.java`

---

## 🔧 Troubleshooting

### Command not appearing
- Check if class has `@Component` annotation
- Check if registered in `CommandHandler.init()`
- Rebuild: `mvn clean compile`

### Service injection fails
- Check service exists and has `@Service`
- Add to `@RequiredArgsConstructor` constructor
- Import correct package

### Message not sending
- Check `chatId` is valid
- Check text is not empty
- Check Telegram bot token is valid

### Logging not showing
- Check log level is INFO or DEBUG
- Use `log.info()` not `System.out.println()`
- Check console during testing

---

## 💡 Pro Tips

1. **Always log** - Add logs for debugging
2. **Validate input** - Check args before using
3. **Handle errors** - Try-catch for robustness
4. **Use permissions** - Check admin/chat type
5. **Be efficient** - Minimize database calls
6. **Document** - Add JavaDoc comments
7. **Test locally** - Test before deploying
8. **Follow patterns** - Use existing code as reference

---

## 📝 Complete Minimal Example

```java
package com.p2abot.command.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.p2abot.command.Command;
import com.p2abot.service.TelegramBotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PingCommand implements Command {
    private final TelegramBotService botService;

    @Override
    public String getCommand() {
        return "/ping";
    }

    @Override
    public String getDescription() {
        return "Ping command - check if bot is alive";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("🏓 [PingCommand] Pong!");
        botService.sendMessage(chatId, "🏓 **Pong!** Bot is alive", null);
    }
}
```

---

**Ready to create your custom commands!** 🚀

Check `CommandHandler.java` to see how to register new commands.
All existing commands in `java-bot/src/main/java/com/p2abot/command/impl/` follow this pattern.

