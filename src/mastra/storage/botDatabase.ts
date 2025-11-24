import pg from "pg";

/**
 * P2A-Bot Database Storage
 * Stores bot data, notes, filters, warnings, and statistics
 * Developer: Gtajisan
 */

export interface BotNote {
  id: string;
  chatId: string;
  name: string;
  content: string;
  createdBy: number;
  createdAt: Date;
}

export interface BotFilter {
  id: string;
  chatId: string;
  keyword: string;
  response: string;
  createdBy: number;
  createdAt: Date;
}

export interface BotWarning {
  id: string;
  chatId: string;
  userId: number;
  reason: string;
  warnedBy: number;
  warnedAt: Date;
}

export interface BotSettings {
  chatId: string;
  welcomeMessage?: string;
  goodbyeMessage?: string;
  rules?: string;
  antifloodEnabled: boolean;
  antifloodLimit: number;
}

export interface BotStats {
  chatId: string;
  messageCount: number;
  userCount: number;
  commandsExecuted: number;
  lastActivity: Date;
}

// Initialize PostgreSQL connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const botStorage = {
  // Notes Management
  async saveNote(note: BotNote): Promise<void> {
    const query = `
      INSERT INTO bot_notes (id, chat_id, name, content, created_by, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (chat_id, name) DO UPDATE
      SET content = $4, created_by = $5, created_at = $6
    `;
    await pool.query(query, [
      note.id,
      note.chatId,
      note.name,
      note.content,
      note.createdBy,
      note.createdAt,
    ]);
  },

  async getNote(chatId: string, name: string): Promise<BotNote | null> {
    const query = `SELECT * FROM bot_notes WHERE chat_id = $1 AND name = $2`;
    const result = await pool.query(query, [chatId, name]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      id: row.id,
      chatId: row.chat_id,
      name: row.name,
      content: row.content,
      createdBy: row.created_by,
      createdAt: row.created_at,
    };
  },

  async getNotes(chatId: string): Promise<BotNote[]> {
    const query = `SELECT * FROM bot_notes WHERE chat_id = $1 ORDER BY name`;
    const result = await pool.query(query, [chatId]);
    return result.rows.map(row => ({
      id: row.id,
      chatId: row.chat_id,
      name: row.name,
      content: row.content,
      createdBy: row.created_by,
      createdAt: row.created_at,
    }));
  },

  async deleteNote(chatId: string, name: string): Promise<boolean> {
    const query = `DELETE FROM bot_notes WHERE chat_id = $1 AND name = $2`;
    const result = await pool.query(query, [chatId, name]);
    return (result.rowCount ?? 0) > 0;
  },

  // Filters Management
  async saveFilter(filter: BotFilter): Promise<void> {
    const query = `
      INSERT INTO bot_filters (id, chat_id, keyword, response, created_by, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (chat_id, keyword) DO UPDATE
      SET response = $4, created_by = $5, created_at = $6
    `;
    await pool.query(query, [
      filter.id,
      filter.chatId,
      filter.keyword,
      filter.response,
      filter.createdBy,
      filter.createdAt,
    ]);
  },

  async getFilters(chatId: string): Promise<BotFilter[]> {
    const query = `SELECT * FROM bot_filters WHERE chat_id = $1 ORDER BY keyword`;
    const result = await pool.query(query, [chatId]);
    return result.rows.map(row => ({
      id: row.id,
      chatId: row.chat_id,
      keyword: row.keyword,
      response: row.response,
      createdBy: row.created_by,
      createdAt: row.created_at,
    }));
  },

  async deleteFilter(chatId: string, keyword: string): Promise<boolean> {
    const query = `DELETE FROM bot_filters WHERE chat_id = $1 AND keyword = $2`;
    const result = await pool.query(query, [chatId, keyword]);
    return (result.rowCount ?? 0) > 0;
  },

  // Warnings Management
  async addWarning(warning: BotWarning): Promise<void> {
    const query = `
      INSERT INTO bot_warnings (id, chat_id, user_id, reason, warned_by, warned_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await pool.query(query, [
      warning.id,
      warning.chatId,
      warning.userId,
      warning.reason,
      warning.warnedBy,
      warning.warnedAt,
    ]);
  },

  async getWarnings(chatId: string, userId: number): Promise<BotWarning[]> {
    const query = `
      SELECT * FROM bot_warnings 
      WHERE chat_id = $1 AND user_id = $2 
      ORDER BY warned_at DESC
    `;
    const result = await pool.query(query, [chatId, userId]);
    return result.rows.map(row => ({
      id: row.id,
      chatId: row.chat_id,
      userId: row.user_id,
      reason: row.reason,
      warnedBy: row.warned_by,
      warnedAt: row.warned_at,
    }));
  },

  async clearWarnings(chatId: string, userId: number): Promise<void> {
    const query = `DELETE FROM bot_warnings WHERE chat_id = $1 AND user_id = $2`;
    await pool.query(query, [chatId, userId]);
  },

  // Settings Management
  async saveSettings(settings: BotSettings): Promise<void> {
    const query = `
      INSERT INTO bot_settings 
      (chat_id, welcome_message, goodbye_message, rules, antiflood_enabled, antiflood_limit)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (chat_id) DO UPDATE
      SET welcome_message = $2, goodbye_message = $3, rules = $4, 
          antiflood_enabled = $5, antiflood_limit = $6
    `;
    await pool.query(query, [
      settings.chatId,
      settings.welcomeMessage,
      settings.goodbyeMessage,
      settings.rules,
      settings.antifloodEnabled,
      settings.antifloodLimit,
    ]);
  },

  async getSettings(chatId: string): Promise<BotSettings | null> {
    const query = `SELECT * FROM bot_settings WHERE chat_id = $1`;
    const result = await pool.query(query, [chatId]);
    if (result.rows.length === 0) {
      return {
        chatId,
        antifloodEnabled: false,
        antifloodLimit: 5,
      };
    }
    const row = result.rows[0];
    return {
      chatId: row.chat_id,
      welcomeMessage: row.welcome_message,
      goodbyeMessage: row.goodbye_message,
      rules: row.rules,
      antifloodEnabled: row.antiflood_enabled,
      antifloodLimit: row.antiflood_limit,
    };
  },

  // Statistics
  async updateStats(chatId: string, increment: Partial<BotStats>): Promise<void> {
    const query = `
      INSERT INTO bot_stats (chat_id, message_count, user_count, commands_executed, last_activity)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (chat_id) DO UPDATE
      SET message_count = bot_stats.message_count + $2,
          user_count = GREATEST(bot_stats.user_count, $3),
          commands_executed = bot_stats.commands_executed + $4,
          last_activity = $5
    `;
    await pool.query(query, [
      chatId,
      increment.messageCount || 0,
      increment.userCount || 0,
      increment.commandsExecuted || 0,
      increment.lastActivity || new Date(),
    ]);
  },

  async getStats(chatId: string): Promise<BotStats | null> {
    const query = `SELECT * FROM bot_stats WHERE chat_id = $1`;
    const result = await pool.query(query, [chatId]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return {
      chatId: row.chat_id,
      messageCount: row.message_count,
      userCount: row.user_count,
      commandsExecuted: row.commands_executed,
      lastActivity: row.last_activity,
    };
  },

  async getAllStats(): Promise<BotStats[]> {
    const query = `SELECT * FROM bot_stats ORDER BY last_activity DESC`;
    const result = await pool.query(query);
    return result.rows.map(row => ({
      chatId: row.chat_id,
      messageCount: row.message_count,
      userCount: row.user_count,
      commandsExecuted: row.commands_executed,
      lastActivity: row.last_activity,
    }));
  },
};

// Initialize database tables
export async function initializeBotDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS bot_notes (
        id TEXT PRIMARY KEY,
        chat_id TEXT NOT NULL,
        name TEXT NOT NULL,
        content TEXT NOT NULL,
        created_by BIGINT NOT NULL,
        created_at TIMESTAMP NOT NULL,
        UNIQUE(chat_id, name)
      );

      CREATE TABLE IF NOT EXISTS bot_filters (
        id TEXT PRIMARY KEY,
        chat_id TEXT NOT NULL,
        keyword TEXT NOT NULL,
        response TEXT NOT NULL,
        created_by BIGINT NOT NULL,
        created_at TIMESTAMP NOT NULL,
        UNIQUE(chat_id, keyword)
      );

      CREATE TABLE IF NOT EXISTS bot_warnings (
        id TEXT PRIMARY KEY,
        chat_id TEXT NOT NULL,
        user_id BIGINT NOT NULL,
        reason TEXT NOT NULL,
        warned_by BIGINT NOT NULL,
        warned_at TIMESTAMP NOT NULL
      );

      CREATE TABLE IF NOT EXISTS bot_settings (
        chat_id TEXT PRIMARY KEY,
        welcome_message TEXT,
        goodbye_message TEXT,
        rules TEXT,
        antiflood_enabled BOOLEAN DEFAULT FALSE,
        antiflood_limit INTEGER DEFAULT 5
      );

      CREATE TABLE IF NOT EXISTS bot_stats (
        chat_id TEXT PRIMARY KEY,
        message_count INTEGER DEFAULT 0,
        user_count INTEGER DEFAULT 0,
        commands_executed INTEGER DEFAULT 0,
        last_activity TIMESTAMP NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_bot_warnings_chat_user ON bot_warnings(chat_id, user_id);
      CREATE INDEX IF NOT EXISTS idx_bot_stats_activity ON bot_stats(last_activity DESC);
    `);
    console.log("✅ P2A-Bot database tables initialized");
  } catch (error) {
    console.error("❌ Failed to initialize bot database:", error);
  } finally {
    client.release();
  }
}
