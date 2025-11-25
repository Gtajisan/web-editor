# Quick Reference - P2A-Bot v2 Commands

## User Commands (DM - Anyone)
```
/start       - Welcome message
/help        - All commands list
/info        - Bot information  
/stats       - Personal stats
/dashboard   - Personal dashboard & links
/rules       - View group rules
/userinfo    - User information
```

## Admin Commands (Group - Admin Only)
```
/settings       - View/modify settings
/rules set      - Set group rules
/dashboard      - Admin dashboard
/antiflood on   - Toggle anti-spam
/welcome <msg>  - Set welcome
/filter add     - Add content filter
```

## Moderation Commands (Works Both)
```
/ban <user>        - Ban user
/unban <user>      - Unban user
/kick <user>       - Kick user
/warn <user>       - Warn user (3 = auto-ban)
/clearwarns <user> - Clear warnings
/mute <user>       - Mute user
/unmute <user>     - Unmute user
/purge <count>     - Delete messages
```

## Management Commands (Both)
```
/note save/get/list/delete - Note management
/filter add/list/remove    - Content filters
/stats                     - Statistics
/logs                      - Recent logs
/userinfo [id]             - User info
/chatinfo                  - Chat info
/adminlist                 - Admin list
/report                    - Report issue
```

## Group Chat Settings
```
Use: /settings <key> <value>

Keys:
- antiflood on/off
- welcome <message>
- auto_warn on/off
- auto_ban on/off
```

## Create Custom Command (3 Steps)

### Step 1: Create File
```
java-bot/src/main/java/com/p2abot/command/impl/MyCommand.java
```

### Step 2: Implement
```java
@Slf4j
@Component
@RequiredArgsConstructor
public class MyCommand implements Command {
    private final TelegramBotService botService;

    @Override public String getCommand() { return "/mycommand"; }
    @Override public String getDescription() { return "My awesome command"; }
    @Override 
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("🚀 [MyCommand] Executing");
        botService.sendMessage(chatId, "Hello from my command!", null);
    }
}
```

### Step 3: Register
```
In CommandHandler.java, add to init():
registry.register(myCommand);
```

### Step 4: Build
```bash
cd java-bot
mvn package -DskipTests
```

## Available Services
```
botService.sendMessage(chatId, text, buttons)
settingsService.getOrCreateSettings(chatId)
permissionChecker.isAdmin(message, userId)
permissionChecker.isGroupChat(message)
automationService.handleAutoWarning(chatId, userId, settings)
```

## Check Permissions
```java
if (!permissionChecker.isAdmin(message, userId)) {
    botService.sendMessage(chatId, "❌ Admin only", null);
    return;
}
```

## Database Access
```java
var settings = settingsService.getOrCreateSettings(chatId);
botService.sendMessage(chatId, "Setting: " + settings.getAntiFloodEnabled(), null);
```

## Logging
```java
log.info("✅ [CommandName] Success");
log.debug("🔍 [CommandName] Debug info");
log.warn("⚠️ [CommandName] Warning");
log.error("❌ [CommandName] Error");
```

---
Quick Reference | P2A-Bot v2
