# Advanced Database Dashboard - P2A-Bot v2

Complete guide to using the advanced monitoring dashboard.

## 🎯 Access Points

### TypeScript Version
```
http://localhost:5000/
Playground with real-time visualization
```

### Java Version
```
http://localhost:8080/api/dashboard/overview
http://localhost:8080/api/health/info
```

### Advanced Dashboard
```
http://localhost:8080/advanced-dashboard.html
Full-featured monitoring interface
```

---

## 📊 Dashboard Features

### 1. Overview Tab
- **Real-time Status:** Bot status, database connection, active chats
- **System Metrics:** Uptime, messages, users warned, users banned
- **Charts:** Command usage visualization, user activity trends

### 2. Statistics Tab
- **Daily Statistics:** Message volume per day
- **Weekly Trends:** Activity patterns
- **Top Commands:** Most used commands with success rates

### 3. Commands Tab
- **23 Total Commands:** All available commands listed
- **Command Details:** Description for each command
- **Quick Reference:** Easy lookup for command syntax

### 4. Database Tab
- **Table Status:** All 5 tables with record counts
- **Database Schema:** Column information for each table
- **Data Size:** Storage usage per table
- **Health Check:** Status verification

### 5. Console Tab
- **Real-time Logs:** Live console output
- **Log Types:** Info, Debug, Warning, Error color-coded
- **Refresh Logs:** Get latest logs on demand
- **Clear Console:** Reset log display

### 6. Settings Tab
- **Bot Configuration:** Version, edition, framework info
- **Adjustable Settings:** Auto-ban threshold, antiflood status
- **Edit Options:** Modify bot behavior

---

## 📈 API Endpoints

### Dashboard Overview
```bash
GET /api/dashboard/overview
```
Returns:
- Total notes, filters, warnings
- Total chats
- System status

### Statistics Summary
```bash
GET /api/dashboard/stats/summary
```
Returns:
- Total messages, warnings, kicks, bans
- Average per chat
- System uptime

### Command Statistics
```bash
GET /api/dashboard/commands/stats
```
Returns:
- Command usage counts
- Most/least used commands
- Total command count

### System Information
```bash
GET /api/dashboard/system/info
```
Returns:
- Bot version and edition
- Framework information
- Resource usage (memory, CPU)

### Recent Logs
```bash
GET /api/dashboard/logs/recent
```
Returns:
- Last 100 log lines
- Timestamp for each entry

### Performance Metrics
```bash
GET /api/dashboard/performance
```
Returns:
- Response times (avg, min, max)
- Requests per second
- Error rates
- System uptime percentage

---

## 🔍 Data Displayed

### Database Tables Information

**telegram_chats** - Group Configurations
- Chat ID, Title, Type
- Member Count, Settings

**bot_notes** - Saved Notes
- Note Key, Content
- Creation/Update timestamps

**bot_filters** - Content Filters
- Pattern, Replacement
- Regex support flag

**bot_warnings** - User Warnings
- User ID, Chat ID, Reason
- Warning count, timestamps

**bot_stats** - Statistics
- Total messages, warnings
- Kicks, bans, notes

---

## 📊 Charts & Visualizations

### Command Usage Chart
- Bar chart showing top 5 commands
- Usage counts per command
- Color-coded by category

### User Activity Chart
- Time-series activity data
- Message volume trends
- Peak usage times

### Daily Statistics
- Line chart of daily message counts
- 7-day rolling view
- Trend analysis

### Weekly Trends
- Week-over-week comparison
- Performance metrics

---

## 🎯 Real-Time Monitoring

### Auto-Refresh
- Dashboard updates every 5 seconds
- Status indicators refresh in real-time
- Console logs stream automatically

### Manual Refresh
- Click "🔄 Refresh" buttons to update sections
- Get latest database stats
- Fetch new console logs

### Custom Intervals
- Configure refresh frequency in settings
- Pause/resume monitoring
- Export metrics

---

## 💡 Console Output

### Log Levels

**INFO (Green)**
- System startup messages
- Command execution
- Successful operations

**DEBUG (Blue)**
- Detailed operation info
- Database queries
- Processing steps

**WARN (Orange)**
- Potential issues
- Deprecation notices
- Resource limits

**ERROR (Red)**
- Failed operations
- Exceptions
- Critical issues

---

## 📋 Usage Examples

### Monitor Bot Health
1. Open Advanced Dashboard
2. Check "Overview" tab
3. View system status
4. Monitor console logs

### Check Database Statistics
1. Go to "Database" tab
2. View table sizes
3. Check schema information
4. Verify table status

### Analyze Command Usage
1. Open "Statistics" tab
2. Review command usage chart
3. Check top commands
4. View success rates

### Debug Issues
1. Switch to "Console" tab
2. Review error logs
3. Check timestamps
4. Trace issue origin

---

## ⚙️ Configuration

### Refresh Frequency
Default: 5 seconds
Change in settings panel

### Log Retention
Default: Last 1000 lines
Configurable in storage settings

### Display Options
- Collapse/expand sections
- Hide specific data types
- Custom column selection

### Export Options
- Export stats as JSON
- Export logs as CSV
- Export charts as images

---

## 🚀 Performance Tips

- Use "Pause" to reduce server load during high traffic
- Clear old logs to improve performance
- Archive statistics periodically
- Optimize database indexes

---

## 🔐 Security

- Dashboard accessible only via localhost (can be changed)
- No sensitive data in logs
- HTTPS recommended for production
- API key protection available

---

## 📊 Metrics Explained

### Response Time
- Measures how fast the bot responds to commands
- Includes processing and sending time

### Success Rate
- Percentage of commands executed successfully
- Excludes permission errors

### Uptime
- Continuous operation time
- Measured in hours/days

### Memory Usage
- Current RAM consumption
- Peak usage tracking

### CPU Usage
- Processor utilization percentage
- Multi-core average

---

## 🆘 Troubleshooting

### Dashboard Not Loading
- Check server is running on port 8080
- Verify database connection
- Check browser console for errors

### Logs Not Updating
- Click "Refresh Logs" button
- Check console output on server
- Verify log level settings

### Charts Not Displaying
- Ensure JavaScript is enabled
- Check Chart.js library loaded
- Verify data format in API responses

### Database Stats Empty
- Run queries to populate data
- Check database initialization
- Verify table creation

---

## 📚 Documentation

- **Full Setup:** `COMPLETE_SETUP.md`
- **API Reference:** `java-bot/API.md`
- **Deployment:** `DEPLOYMENT.md`
- **Commands:** `ROSE_BOT_FEATURES.md`

---

## 🎉 Summary

The Advanced Dashboard provides:
- ✅ Real-time system monitoring
- ✅ Database visualization
- ✅ Performance metrics
- ✅ Command analytics
- ✅ Live console logs
- ✅ Configuration management

**Status:** ✅ FULLY OPERATIONAL

---

**Version:** 2.0.0  
**Last Updated:** November 25, 2024
