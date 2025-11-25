# P2A-Bot v2 API Documentation

Complete REST API reference for P2A-Bot Java Edition.

## 🔌 API Base URL
```
http://localhost:8080/api
```

## 🏥 Health & Info

### Health Check
```bash
GET /health
```
Returns bot status and version info.

### Bot Information
```bash
GET /health/info
```
Returns detailed bot information.

### Database Status
```bash
GET /database/status
```
Check SQLite database connection.

## 📝 Notes API

### Save Note
```bash
POST /bot/{chatId}/notes?key=greeting&content=Hello%20everyone!
```

### Get Note
```bash
GET /bot/{chatId}/notes/{key}
```

### List All Notes
```bash
GET /bot/{chatId}/notes
```

### Delete Note
```bash
DELETE /bot/{chatId}/notes/{key}
```

## ⚠️ Warnings API

### Add Warning
```bash
POST /bot/{chatId}/warnings/{userId}?reason=Spam
```

### Get Warning Count
```bash
GET /bot/{chatId}/warnings/{userId}
```

### Clear Warnings
```bash
DELETE /bot/{chatId}/warnings/{userId}
```

## 🔧 Filters API

### Add Filter
```bash
POST /bot/{chatId}/filters?pattern=bad&replacement=***&regex=false
```

### List Filters
```bash
GET /bot/{chatId}/filters
```

### Delete Filter
```bash
DELETE /bot/{chatId}/filters/{filterId}
```

## 📊 Stats API

### Get Chat Stats
```bash
GET /stats/{chatId}
```

### Get Detailed Stats
```bash
GET /bot/{chatId}/stats
```

### Increment Stat
```bash
POST /bot/{chatId}/stats/increment/{action}
```
Actions: `message`, `warning`, `ban`, `kick`

## 💾 Database API

### List Tables
```bash
GET /database/tables
```

### Get Schema
```bash
GET /database/schema
```

### Initialize Database
```bash
POST /database/init
```

## 🔔 Telegram Webhook

### Receive Update
```bash
POST /webhook/telegram
```
Telegram sends updates to this endpoint.

## 📚 Example Requests

### Save a Group Greeting
```bash
curl -X POST http://localhost:8080/api/bot/12345/notes \
  -d "key=greeting" \
  -d "content=Welcome to our group!"
```

### Warn a User
```bash
curl -X POST http://localhost:8080/api/bot/12345/warnings/67890 \
  -d "reason=Spam"
```

### Get Chat Statistics
```bash
curl http://localhost:8080/api/bot/12345/stats
```

### List All Notes
```bash
curl http://localhost:8080/api/bot/12345/notes
```

### Check Database Status
```bash
curl http://localhost:8080/api/database/status
```

## 🔄 Response Format

All responses follow this format:

### Success Response
```json
{
  "status": "success",
  "data": { /* response data */ },
  "timestamp": 1234567890
}
```

### Note Response
```json
{
  "id": "uuid-string",
  "chatId": 12345,
  "noteKey": "greeting",
  "noteContent": "Welcome!",
  "createdAt": "2024-11-25T10:30:00",
  "updatedAt": "2024-11-25T10:30:00"
}
```

### Stats Response
```json
{
  "id": 1,
  "chatId": 12345,
  "totalMessages": 1500,
  "usersWarned": 5,
  "usersKicked": 2,
  "usersBanned": 1,
  "notesSaved": 8,
  "createdAt": "2024-11-25T10:00:00",
  "updatedAt": "2024-11-25T10:30:00"
}
```

## 🔐 Authentication
No authentication required (open API).

## ⚡ Rate Limits
No rate limits configured (unlimited requests).

## 🚨 Error Codes
- `200` - OK
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

## 📱 TypeScript Version API

The TypeScript version uses Mastra framework:
```
POST /api/workflow/trigger
GET /api/agent/status
```

See TypeScript API docs for details.

---

**API Version:** 2.0.0  
**Last Updated:** November 25, 2024
