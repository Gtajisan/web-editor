# 🐐 P2A-Bot v2 - COMPLETE GUIDE (Make Your Own Commands)

The ultimate guide to P2A-Bot v2 with instructions on creating custom commands.

---

## 🎯 What You Have

### ✅ Two Full Bots
1. **TypeScript Version** - Mastra + PostgreSQL (Port 5000)
2. **Java GOAT Version** - Spring Boot + SQLite (Port 8080)

### ✅ 23+ Built-in Commands
- Moderation: `/ban`, `/kick`, `/warn`, `/mute`, etc.
- Management: `/note`, `/filter`, `/stats`, `/info`
- Admin: `/settings`, `/rules`, `/dashboard`

### ✅ Advanced Features
- Real-time dashboard with 6 tabs
- Group settings & rules per chat
- User automation (auto-warn, auto-mute, auto-ban)
- Permission system (Admin-only in groups, anyone in DM)
- Database persistence
- 18+ API endpoints

---

## 🚀 Quick Start

### Run TypeScript Version
```bash
npm run dev
# Playground: http://localhost:5000/
```

### Run Java Version
```bash
cd java-bot
java -jar target/p2a-bot-java-2.0.0.jar
# Dashboard: http://localhost:8080/advanced-dashboard.html
```

---

## 🎮 Using the Bot in Telegram

### In Personal DM (Anyone Can Use)
```
/start           - Welcome message
/help            - All available commands
/info            - Bot information
/stats           - Personal statistics
/dashboard       - Personal dashboard & links
/rules           - View group rules
```

### In Group Chat (Admin Only to Configure)
```
/settings        - View/modify group settings (ADMIN)
/rules set       - Set group rules (ADMIN)
/dashboard       - Admin dashboard (ADMIN)
/antiflood on    - Toggle anti-spam (ADMIN)
/welcome <msg>   - Set welcome message (ADMIN)
/filter add      - Add content filter (ADMIN)

/ban @user       - Ban user
/kick @user      - Kick user
/warn @user      - Warn user (auto-ban at 3)
/mute @user      - Mute user
/unmute @user    - Unmute user
/stats           - Group statistics
/help            - View all commands
```

---

## 📚 Documentation Files

### Setup & Deployment
- **COMPLETE_SETUP.md** - Full setup instructions
- **GETTING_STARTED.md** - Quick start guide
- **DEPLOYMENT.md** - Deploy to cloud (Render, Railway, etc.)
- **java-bot/QUICKSTART.md** - Java version quick start
- **java-bot/SETUP.md** - Java detailed setup

### Features & Usage
- **ROSE_BOT_FEATURES.md** - All 23 commands explained
- **ADVANCED_AUTOMATION.md** - Permission system & automation
- **ADVANCED_DASHBOARD_GUIDE.md** - Dashboard usage
- **CREATE_CUSTOM_COMMANDS_GUIDE.md** - Make your own commands (THIS!)

### API & Development
- **java-bot/API.md** - REST API endpoints
- **java-bot/README.md** - Java version details
- **README.md** - Main project documentation

---

## 🎨 Create Your Own Commands (GOAT Style)

### Quick Example: 3-Step Process

#### Step 1: Create Command File
```
File: java-bot/src/main/java/com/p2abot/command/impl/MyAwesomeCommand.java
```

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
public class MyAwesomeCommand implements Command {
    private final TelegramBotService botService;

    @Override
    public String getCommand() {
        return "/mycommand";
    }

    @Override
    public String getDescription() {
        return "Does something awesome";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("🚀 [MyAwesomeCommand] Executing");
        
        String response = "✅ Your awesome command works!\n" +
                         "Arguments received: " + args;
        
        botService.sendMessage(chatId, response, null);
    }
}
```

#### Step 2: Register Command
```
File: java-bot/src/main/java/com/p2abot/command/CommandHandler.java
```

Find the `init()` method and add:
```java
private final MyAwesomeCommand myAwesomeCommand;

public void init() {
    // ... existing commands
    registry.register(myAwesomeCommand);
    log.info("✅ MyAwesomeCommand registered");
}
```

#### Step 3: Rebuild & Test
```bash
cd java-bot
mvn clean package -DskipTests
# Test in Telegram: /mycommand arg1 arg2
```

---

## 📋 Command Templates

### Template 1: Simple Command (No Args)
```java
@Override
public void execute(Long chatId, Long userId, String args, JsonNode message) {
    log.info("🔧 [SimpleCommand] Executing");
    botService.sendMessage(chatId, "Hello from simple command!", null);
}
```

### Template 2: With Arguments
```java
@Override
public void execute(Long chatId, Long userId, String args, JsonNode message) {
    log.info("📝 [ArgCommand] Args: {}", args);
    
    String[] parts = args.split(" ");
    if (parts.length == 0) {
        botService.sendMessage(chatId, "Usage: /cmd <arg1> <arg2>", null);
        return;
    }
    
    String result = "You said: " + String.join(" ", parts);
    botService.sendMessage(chatId, result, null);
}
```

### Template 3: Admin Only (In Groups)
```java
@Override
public void execute(Long chatId, Long userId, String args, JsonNode message) {
    if (permissionChecker.isGroupChat(message) && 
        !permissionChecker.isAdmin(message, userId)) {
        botService.sendMessage(chatId, "❌ Admin only", null);
        return;
    }
    
    botService.sendMessage(chatId, "✅ Admin command executed", null);
}
```

### Template 4: Database Backed
```java
@Override
public void execute(Long chatId, Long userId, String args, JsonNode message) {
    // Save to database
    var data = new MyData();
    data.setChatId(chatId);
    data.setUserId(userId);
    data.setContent(args);
    repository.save(data);
    
    botService.sendMessage(chatId, "✅ Saved to database", null);
}
```

### Template 5: Conditional Logic
```java
@Override
public void execute(Long chatId, Long userId, String args, JsonNode message) {
    if (permissionChecker.isPrivateChat(message)) {
        botService.sendMessage(chatId, "DM mode activated", null);
    } else if (permissionChecker.isGroupChat(message)) {
        botService.sendMessage(chatId, "Group mode activated", null);
    }
}
```

---

## 🔒 Permission System Reference

### Check Permissions
```java
// Inject this
private final PermissionChecker permissionChecker;

// Methods available
permissionChecker.isAdmin(message, userId)           // Is admin in group
permissionChecker.isGroupChat(message)               // Is group/supergroup
permissionChecker.isPrivateChat(message)             // Is DM
permissionChecker.getChatType(message)               // Get chat type
permissionChecker.getFromUserId(message)             // Get user ID
permissionChecker.getChatId(message)                 // Get chat ID
```

---

## 💾 Database Services Reference

### Services You Can Inject
```java
private final TelegramBotService botService;
private final GroupSettingsService settingsService;
private final AutomationService automationService;
private final UserWarningService warningService;
private final BotNoteRepository noteRepository;
private final BotFilterRepository filterRepository;
private final UserRulesRepository rulesRepository;
// ... more repositories
```

### Common Operations
```java
// Get/set group settings
var settings = settingsService.getOrCreateSettings(chatId);
settingsService.updateSetting(chatId, "antiflood", true);

// Get/set rules
settingsService.setRules(chatId, "Be respectful");
String rules = settingsService.getRules(chatId);

// Trigger automation
automationService.handleAutoWarning(chatId, userId, settings);
automationService.checkAndEnforceMutes(chatId);

// Send message
botService.sendMessage(chatId, "Message text", null);
```

---

## 📊 Available Logging Levels

```java
log.info("✅ [CommandName] Success message");      // Green
log.debug("🔍 [CommandName] Debug info");          // Blue
log.warn("⚠️ [CommandName] Warning");              // Orange
log.error("❌ [CommandName] Error message");       // Red
```

---

## 🧪 Testing Your Command

### Test 1: Compile Check
```bash
cd java-bot
mvn compile
```

### Test 2: Full Build
```bash
mvn package -DskipTests
```

### Test 3: In Telegram
1. Send your command to bot in DM
2. Check console output for logs
3. Verify response in Telegram

### Test 4: Debug
```bash
tail -f logs/spring.log | grep YourCommandName
```

---

## 🎯 Advanced Examples

### Example 1: Counter Command
```java
@Component
@RequiredArgsConstructor
public class CounterCommand implements Command {
    private final TelegramBotService botService;
    private final CounterRepository counterRepository;

    @Override
    public String getCommand() { return "/count"; }
    
    @Override
    public String getDescription() { return "Increment counter"; }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        var counter = counterRepository.findByChatId(chatId)
            .orElse(new Counter());
        counter.setChatId(chatId);
        counter.setValue((counter.getValue() != null ? counter.getValue() : 0) + 1);
        counterRepository.save(counter);
        
        botService.sendMessage(chatId, 
            "🔢 Count: " + counter.getValue(), null);
    }
}
```

### Example 2: Scheduled Task Command
```java
@Override
public void execute(Long chatId, Long userId, String args, JsonNode message) {
    String taskName = args.isEmpty() ? "Task" : args;
    
    // Create task
    Task task = new Task();
    task.setName(taskName);
    task.setChatId(chatId);
    task.setUserId(userId);
    taskRepository.save(task);
    
    botService.sendMessage(chatId, 
        "✅ Task '" + taskName + "' created", null);
}
```

### Example 3: Info Query Command
```java
@Override
public void execute(Long chatId, Long userId, String args, JsonNode message) {
    String query = args;
    
    // Search database
    List<Data> results = dataRepository.search(query);
    
    if (results.isEmpty()) {
        botService.sendMessage(chatId, "No results found", null);
        return;
    }
    
    StringBuilder response = new StringBuilder("📋 Results:\n\n");
    for (Data data : results) {
        response.append("• ").append(data.getName()).append("\n");
    }
    
    botService.sendMessage(chatId, response.toString(), null);
}
```

---

## 🚀 Deployment Steps

### Step 1: Create & Register Command
```bash
# Create command file
vi java-bot/src/main/java/com/p2abot/command/impl/YourCommand.java

# Register in CommandHandler.java
# Add private field and registry.register() call
```

### Step 2: Compile & Build
```bash
cd java-bot
mvn clean package -DskipTests
```

### Step 3: Test Locally
```bash
java -jar target/p2a-bot-java-2.0.0.jar
# Send /yourcommand in Telegram
```

### Step 4: Deploy to Cloud
```bash
# See DEPLOYMENT.md for full instructions
# Deploy to Render, Railway, Heroku, etc.
```

---

## 📋 Checklist: Before Deploying Custom Command

- ✅ File created in `command/impl/YourCommand.java`
- ✅ Implements `Command` interface
- ✅ Has `@Component` and `@Slf4j` annotations
- ✅ Services injected via `@RequiredArgsConstructor`
- ✅ Registered in `CommandHandler.init()`
- ✅ Compiled: `mvn compile`
- ✅ Built: `mvn package`
- ✅ Tested in Telegram
- ✅ Logs appear in console
- ✅ Ready to deploy!

---

## 📚 Reference Files

### To Study for Ideas
- `BanCommand.java` - Moderation example
- `NoteCommand.java` - Database persistence
- `SettingsCommand.java` - Permission checking
- `StatsCommand.java` - Information display

### Key Interfaces
- `Command.java` - Command interface
- `TelegramBotService.java` - Send messages
- `PermissionChecker.java` - Check permissions

---

## 💡 Pro Tips

1. **Always add logging** with emojis for clarity
2. **Validate input** before processing
3. **Check permissions** for sensitive commands
4. **Use database** for persistence
5. **Handle errors** gracefully
6. **Test early** in development
7. **Read existing code** for patterns
8. **Keep it simple** - KISS principle

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Command not appearing | Add `@Component` annotation |
| Service not injecting | Check `@RequiredArgsConstructor` |
| Message not sending | Verify `chatId` is correct |
| Compilation fails | Check imports and syntax |
| Not registered | Add to `CommandHandler.init()` |
| No logs showing | Use `log.info()` not `System.out` |

---

## 🎓 Learning Path

1. **Start:** Create simple `/hello` command
2. **Learn:** Add arguments parsing
3. **Master:** Permission checks
4. **Advanced:** Database operations
5. **Expert:** Automation & scheduling

---

## 🔗 Quick Links

- **Dashboard:** http://localhost:8080/advanced-dashboard.html
- **API Docs:** See `java-bot/API.md`
- **All Commands:** `/help` in Telegram
- **Group Settings:** `/settings` (admin)
- **Rules:** `/rules` in group

---

## 🎉 Summary

You now have:
- ✅ Full-featured Telegram bot
- ✅ 23+ built-in commands
- ✅ Permission system
- ✅ Database persistence
- ✅ Advanced dashboard
- ✅ Easy custom command creation
- ✅ Complete documentation

**Everything you need to create an unlimited amount of custom commands!**

---

## 📞 Support

For help:
1. Check `CREATE_CUSTOM_COMMANDS_GUIDE.md`
2. Study existing command files
3. Review `ADVANCED_AUTOMATION.md`
4. Check console logs for errors

---

**Version:** 2.0.0 GOAT Edition  
**Status:** ✅ PRODUCTION READY  
**Created:** November 25, 2024

**Ready to create unlimited custom commands!** 🚀

