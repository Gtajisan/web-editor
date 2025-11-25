# P2A-Bot v2 - Advanced Automation & Permission System

Complete guide to the advanced automation and permission system for Telegram.

## 🎯 Core Features

### 1. Permission System
- **Group Chat (GC):** Admin-only for configuration
- **Direct Message (DM):** Anyone can access
- **Automation:** Runs for all users based on rules

### 2. Context Detection
- **isGroupChat():** Detect if message is from group/supergroup
- **isPrivateChat():** Detect if message is from DM
- **isAdmin():** Check if user is group admin
- **getChatType():** Get chat type (private/group/supergroup)

---

## 👥 Permission Levels

### User (DM Access)
```
✅ /help           - View all commands
✅ /stats          - Personal statistics
✅ /dashboard      - Personal dashboard
✅ /rules          - View group rules (if in group)
✅ /userinfo       - View their info
✅ /info           - Bot information
✅ /start          - Welcome message
```

### Admin (Group Admin)
```
✅ /settings       - Modify group settings
✅ /rules set      - Set group rules
✅ /ban            - Ban users
✅ /kick           - Kick users
✅ /warn           - Warn users
✅ /mute           - Mute users
✅ /unmute         - Unmute users
✅ /clearwarns     - Clear warnings
✅ /dashboard      - Group dashboard
✅ /antiflood      - Toggle antiflood
✅ /welcome        - Set welcome message
✅ /filter add     - Add content filters
❌ /help, /stats, /info  - Regular user commands still available
```

---

## ⚙️ Group Settings

### Configurable Settings
```
antiFloodEnabled       - Anti-spam protection
autoWarnEnabled        - Auto-warning system
autoMuteEnabled        - Auto-mute after warnings
autoBanEnabled         - Auto-ban after warnings
welcomeEnabled         - Welcome message
filterEnabled          - Content filtering

thresholds:
- antiFloodThreshold   - Messages per minute
- autoWarnThreshold    - Actions before mute
- autoBanAfterWarnings - Warnings before ban (default: 3)
- autoMuteDuration     - Mute duration in minutes
```

### Storage
- Database: `group_settings` table
- Per chat: `chatId` as unique key
- Persistent: Survives bot restart

---

## 🤖 Automation Rules

### Auto-Warning System
```
Triggered when:
- User violates antiflood rule
- User uses banned words
- User spams links
- User posts too fast

Result:
- Warning count increases
- Message logged
- User notified
```

### Auto-Mute System
```
Triggered when:
- Warning count >= autoWarnThreshold
- Mute duration set by admin

Result:
- User muted in group
- Automatic unmute after duration
- Action logged
```

### Auto-Ban System
```
Triggered when:
- Warning count >= autoBanAfterWarnings (default: 3)
- Manual ban by admin

Result:
- User banned from group
- Permanent until admin unbans
- Action logged with reason
```

### Anti-Flood Protection
```
Monitors:
- Messages per minute
- Repeated content
- Link spam
- Bot mentions

Action:
- Auto-mute user
- Delete spam messages
- Warn user
```

---

## 📊 User Rules Storage

### UserRules Table
```sql
id           - UUID primary key
chatId       - Group ID
userId       - User ID
warningCount - Current warnings (0-3)
muted        - Boolean mute status
banned       - Boolean ban status
mutedUntil   - Timestamp when mute expires
violations   - Violation description
createdAt    - When rule created
updatedAt    - Last modification
```

### Data Persistence
- Track per user, per group
- Automatic cleanup on unmute
- Historical record of violations

---

## 🎮 Usage Examples

### For Users (DM)

**View Help**
```
/help
→ Shows all 23 commands available in DM
```

**Access Dashboard**
```
/dashboard
→ Opens personal dashboard with:
  - Personal statistics
  - Command usage
  - System info
```

**View Rules**
```
/rules
→ Shows group rules (when querying from group context)
```

### For Admins (Group)

**Set Group Rules**
```
/rules set Be respectful, No spam, No links
→ Updates group rules stored in database
```

**Configure Settings**
```
/settings antiflood on
→ Enable anti-flood protection

/settings welcome Welcome @{user}!
→ Set custom welcome message
```

**Manage Users**
```
/warn @user Spamming
→ Issue warning (auto-ban at 3)

/mute @user 30
→ Mute for 30 minutes

/ban @user
→ Permanent ban
```

**Access Admin Dashboard**
```
/dashboard
→ Opens admin dashboard with:
  - Group statistics
  - User rules/violations
  - System performance
  - Group settings
```

---

## 🔐 Security & Privacy

### Permission Checks
```
Every command:
1. Checks if admin (in group) or user (in DM)
2. Validates permission level
3. Logs action with user/chat ID
4. Returns permission denied if needed
```

### Data Isolation
```
- User data isolated by chatId/userId
- No cross-group access
- Admin actions logged
- Audit trail maintained
```

### Sensitive Operations
```
Admin only:
- /settings        - Group configuration
- /rules set       - Rule modification
- /ban, /kick      - User removal
- /filter add      - Content filtering
- /welcome set     - Group customization
```

---

## 📈 Automation Flow

### Message Processing
```
1. User sends message in group
   ↓
2. PermissionChecker validates context
   ↓
3. Check if user already muted/banned
   ↓
4. AutomationService evaluates rules
   ↓
5. If violation:
   - Increment warning count
   - Check auto-mute threshold
   - Check auto-ban threshold
   - Execute action (mute/ban)
   ↓
6. Log action to database
```

### Time-Based Automation
```
Every minute:
- CheckAndEnforceMutes()
- Unmute expired users
- Check active automations
- Verify system health
```

---

## 💾 Database Schema Updates

### New Tables
```sql
group_settings
- Per-group configuration
- Admin preferences
- Automation settings

user_rules
- Per-user, per-group status
- Warning history
- Violation tracking
```

### Relationships
```
telegram_chats (1) ← → (N) group_settings
telegram_chats (1) ← → (N) user_rules
```

---

## 🔄 API Integration

### Dashboard Integration
```
GET /api/dashboard/overview
→ Shows group settings and automation status

GET /api/dashboard/stats/summary
→ Shows rules violations and automation actions

GET /api/dashboard/system/info
→ Shows automation config
```

### Admin API Endpoints (Future)
```
POST /api/groups/{chatId}/settings
PUT  /api/groups/{chatId}/settings/{key}
DELETE /api/groups/{chatId}/settings/{key}

GET /api/groups/{chatId}/rules
POST /api/groups/{chatId}/rules
PUT /api/groups/{chatId}/rules

GET /api/groups/{chatId}/users
GET /api/groups/{chatId}/users/{userId}/rules
PUT /api/groups/{chatId}/users/{userId}/rules
```

---

## 📋 Command Reference

### Group Admin Commands
```
/settings              - View/modify settings
/rules set            - Set group rules
/dashboard            - Admin dashboard
/antiflood on/off     - Toggle anti-spam
/welcome <msg>        - Set welcome
/filter add           - Add filter
/ban <user>           - Ban user
/kick <user>          - Kick user
/warn <user> <reason> - Warn user
/mute <user> <time>   - Mute user
/unmute <user>        - Unmute user
```

### User DM Commands
```
/start                - Welcome
/help                 - All commands
/info                 - Bot info
/stats                - Statistics
/dashboard            - Personal dashboard
/rules                - View rules
/userinfo             - User info
/report <issue>       - Report to admin
```

---

## ✅ Testing Automation

### Test Antiflood
```
1. Enable antiflood: /settings antiflood on
2. Spam messages rapidly
3. User auto-muted
4. Check user_rules table
```

### Test Auto-Warning
```
1. Enable auto-warn: /settings auto_warn on
2. Warn user 3 times: /warn @user
3. User auto-banned
4. Check ban status in database
```

### Test Permission Check
```
1. User tries /settings in group
2. Should see "Admin only"
3. Same user tries in DM
4. Should see their personal settings
```

---

## 🚀 Deployment Checklist

- ✅ PermissionChecker implemented
- ✅ GroupSettings model created
- ✅ UserRules model created
- ✅ GroupSettingsService implemented
- ✅ AutomationService implemented
- ✅ Permission-aware commands created
- ✅ Database migrations ready
- ✅ API endpoints updated
- ✅ Dashboard integrated
- ✅ Logging comprehensive

---

## 📊 Metrics Tracked

### Per Group
- Active members
- Total warnings issued
- Total bans/mutes
- Filter violations
- Antiflood triggers

### Per User
- Warning count
- Mute history
- Ban history
- Violation history
- Last action timestamp

---

## 🎯 Future Enhancements

- [ ] Web-based admin panel
- [ ] Webhook for external systems
- [ ] Schedule-based automations
- [ ] Custom automation rules builder
- [ ] Multi-language support
- [ ] Advanced analytics

---

## 📚 Documentation

- **Setup:** `COMPLETE_SETUP.md`
- **Commands:** `ROSE_BOT_FEATURES.md`
- **Dashboard:** `ADVANCED_DASHBOARD_GUIDE.md`
- **API:** `java-bot/API.md`

---

**Version:** 2.0.0  
**Status:** ✅ PRODUCTION READY  
**Last Updated:** November 25, 2024
