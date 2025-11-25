#!/bin/bash
export TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:=}"
echo "🚀 Starting P2A-Bot v2 (Java GOAT Edition)..."
echo "📦 Database: SQLite (p2a-bot-data.db)"
echo "🌐 API Server: http://localhost:8080"
java -jar target/p2a-bot-java-2.0.0.jar
