import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { botStorage } from "../storage/botDatabase";
import { v4 as uuidv4 } from "uuid";

/**
 * Advanced P2A-Bot Tools
 * Developer: Gtajisan
 * 
 * Tools for notes, filters, warnings, and settings management
 */

/**
 * Save Note Tool
 */
export const saveNoteTool = createTool({
  id: "save-note",
  description: "Save a note for a chat",
  inputSchema: z.object({
    chatId: z.string().describe("Chat ID"),
    name: z.string().describe("Note name"),
    content: z.string().describe("Note content"),
    createdBy: z.number().describe("User ID who created the note"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [saveNoteTool] Saving note", { chatId: context.chatId, name: context.name });

    try {
      await botStorage.saveNote({
        id: uuidv4(),
        chatId: context.chatId,
        name: context.name,
        content: context.content,
        createdBy: context.createdBy,
        createdAt: new Date(),
      });

      logger?.info("✅ [saveNoteTool] Note saved successfully");
      return {
        success: true,
        message: `Note "${context.name}" saved successfully!`,
      };
    } catch (error: any) {
      logger?.error("❌ [saveNoteTool] Failed to save note", { error: error.message });
      return {
        success: false,
        message: `Failed to save note: ${error.message}`,
      };
    }
  },
});

/**
 * Get Note Tool
 */
export const getNoteTool = createTool({
  id: "get-note",
  description: "Retrieve a saved note",
  inputSchema: z.object({
    chatId: z.string().describe("Chat ID"),
    name: z.string().describe("Note name"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    content: z.string().optional(),
    message: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [getNoteTool] Retrieving note", { chatId: context.chatId, name: context.name });

    try {
      const note = await botStorage.getNote(context.chatId, context.name);
      
      if (!note) {
        logger?.info("ℹ️ [getNoteTool] Note not found");
        return {
          success: false,
          message: `Note "${context.name}" not found.`,
        };
      }

      logger?.info("✅ [getNoteTool] Note retrieved successfully");
      return {
        success: true,
        content: note.content,
        message: note.content,
      };
    } catch (error: any) {
      logger?.error("❌ [getNoteTool] Failed to retrieve note", { error: error.message });
      return {
        success: false,
        message: `Failed to retrieve note: ${error.message}`,
      };
    }
  },
});

/**
 * List Notes Tool
 */
export const listNotesTool = createTool({
  id: "list-notes",
  description: "List all saved notes for a chat",
  inputSchema: z.object({
    chatId: z.string().describe("Chat ID"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    notes: z.array(z.string()).optional(),
    message: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [listNotesTool] Listing notes", { chatId: context.chatId });

    try {
      const notes = await botStorage.getNotes(context.chatId);
      
      if (notes.length === 0) {
        return {
          success: true,
          notes: [],
          message: "No notes saved for this chat.",
        };
      }

      const noteNames = notes.map(n => n.name);
      logger?.info("✅ [listNotesTool] Retrieved notes", { count: notes.length });
      
      return {
        success: true,
        notes: noteNames,
        message: `Saved notes: ${noteNames.join(", ")}`,
      };
    } catch (error: any) {
      logger?.error("❌ [listNotesTool] Failed to list notes", { error: error.message });
      return {
        success: false,
        message: `Failed to list notes: ${error.message}`,
      };
    }
  },
});

/**
 * Delete Note Tool
 */
export const deleteNoteTool = createTool({
  id: "delete-note",
  description: "Delete a saved note",
  inputSchema: z.object({
    chatId: z.string().describe("Chat ID"),
    name: z.string().describe("Note name"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [deleteNoteTool] Deleting note", { chatId: context.chatId, name: context.name });

    try {
      const deleted = await botStorage.deleteNote(context.chatId, context.name);
      
      if (!deleted) {
        return {
          success: false,
          message: `Note "${context.name}" not found.`,
        };
      }

      logger?.info("✅ [deleteNoteTool] Note deleted successfully");
      return {
        success: true,
        message: `Note "${context.name}" deleted successfully!`,
      };
    } catch (error: any) {
      logger?.error("❌ [deleteNoteTool] Failed to delete note", { error: error.message });
      return {
        success: false,
        message: `Failed to delete note: ${error.message}`,
      };
    }
  },
});

/**
 * Add Warning Tool
 */
export const addWarningTool = createTool({
  id: "add-warning",
  description: "Add a warning to a user",
  inputSchema: z.object({
    chatId: z.string().describe("Chat ID"),
    userId: z.number().describe("User ID to warn"),
    reason: z.string().describe("Reason for warning"),
    warnedBy: z.number().describe("Admin user ID who issued warning"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    warningCount: z.number(),
    message: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [addWarningTool] Adding warning", { 
      chatId: context.chatId, 
      userId: context.userId 
    });

    try {
      await botStorage.addWarning({
        id: uuidv4(),
        chatId: context.chatId,
        userId: context.userId,
        reason: context.reason,
        warnedBy: context.warnedBy,
        warnedAt: new Date(),
      });

      const warnings = await botStorage.getWarnings(context.chatId, context.userId);
      const count = warnings.length;

      logger?.info("✅ [addWarningTool] Warning added", { warningCount: count });
      
      return {
        success: true,
        warningCount: count,
        message: `Warning issued. User now has ${count} warning(s). Reason: ${context.reason}`,
      };
    } catch (error: any) {
      logger?.error("❌ [addWarningTool] Failed to add warning", { error: error.message });
      return {
        success: false,
        warningCount: 0,
        message: `Failed to add warning: ${error.message}`,
      };
    }
  },
});

/**
 * Get Warnings Tool
 */
export const getWarningsTool = createTool({
  id: "get-warnings",
  description: "Get warnings for a user",
  inputSchema: z.object({
    chatId: z.string().describe("Chat ID"),
    userId: z.number().describe("User ID"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    warningCount: z.number(),
    warnings: z.array(z.object({
      reason: z.string(),
      date: z.string(),
    })).optional(),
    message: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [getWarningsTool] Getting warnings", { 
      chatId: context.chatId, 
      userId: context.userId 
    });

    try {
      const warnings = await botStorage.getWarnings(context.chatId, context.userId);
      
      logger?.info("✅ [getWarningsTool] Warnings retrieved", { count: warnings.length });
      
      return {
        success: true,
        warningCount: warnings.length,
        warnings: warnings.map(w => ({
          reason: w.reason,
          date: w.warnedAt.toISOString(),
        })),
        message: warnings.length > 0 
          ? `User has ${warnings.length} warning(s)`
          : "User has no warnings",
      };
    } catch (error: any) {
      logger?.error("❌ [getWarningsTool] Failed to get warnings", { error: error.message });
      return {
        success: false,
        warningCount: 0,
        message: `Failed to get warnings: ${error.message}`,
      };
    }
  },
});

/**
 * Clear Warnings Tool
 */
export const clearWarningsTool = createTool({
  id: "clear-warnings",
  description: "Clear all warnings for a user",
  inputSchema: z.object({
    chatId: z.string().describe("Chat ID"),
    userId: z.number().describe("User ID"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [clearWarningsTool] Clearing warnings", { 
      chatId: context.chatId, 
      userId: context.userId 
    });

    try {
      await botStorage.clearWarnings(context.chatId, context.userId);
      
      logger?.info("✅ [clearWarningsTool] Warnings cleared");
      return {
        success: true,
        message: "All warnings cleared for user",
      };
    } catch (error: any) {
      logger?.error("❌ [clearWarningsTool] Failed to clear warnings", { error: error.message });
      return {
        success: false,
        message: `Failed to clear warnings: ${error.message}`,
      };
    }
  },
});

/**
 * Save Filter Tool
 */
export const saveFilterTool = createTool({
  id: "save-filter",
  description: "Save an auto-response filter for a chat",
  inputSchema: z.object({
    chatId: z.string().describe("Chat ID"),
    keyword: z.string().describe("Keyword to trigger the filter"),
    response: z.string().describe("Auto-response text"),
    createdBy: z.number().describe("User ID who created the filter"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [saveFilterTool] Saving filter", { chatId: context.chatId, keyword: context.keyword });

    try {
      await botStorage.saveFilter({
        id: uuidv4(),
        chatId: context.chatId,
        keyword: context.keyword.toLowerCase(),
        response: context.response,
        createdBy: context.createdBy,
        createdAt: new Date(),
      });

      logger?.info("✅ [saveFilterTool] Filter saved successfully");
      return {
        success: true,
        message: `Filter "${context.keyword}" saved successfully!`,
      };
    } catch (error: any) {
      logger?.error("❌ [saveFilterTool] Failed to save filter", { error: error.message });
      return {
        success: false,
        message: `Failed to save filter: ${error.message}`,
      };
    }
  },
});

/**
 * Get Filters Tool
 */
export const getFiltersTool = createTool({
  id: "get-filters",
  description: "Get all filters for a chat",
  inputSchema: z.object({
    chatId: z.string().describe("Chat ID"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    filters: z.array(z.object({
      keyword: z.string(),
      response: z.string(),
    })).optional(),
    message: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [getFiltersTool] Getting filters", { chatId: context.chatId });

    try {
      const filters = await botStorage.getFilters(context.chatId);

      if (filters.length === 0) {
        return {
          success: true,
          filters: [],
          message: "No filters set for this chat.",
        };
      }

      logger?.info("✅ [getFiltersTool] Filters retrieved", { count: filters.length });
      return {
        success: true,
        filters: filters.map(f => ({
          keyword: f.keyword,
          response: f.response,
        })),
        message: `Found ${filters.length} filter(s)`,
      };
    } catch (error: any) {
      logger?.error("❌ [getFiltersTool] Failed to get filters", { error: error.message });
      return {
        success: false,
        message: `Failed to get filters: ${error.message}`,
      };
    }
  },
});

/**
 * Delete Filter Tool
 */
export const deleteFilterTool = createTool({
  id: "delete-filter",
  description: "Delete a filter from a chat",
  inputSchema: z.object({
    chatId: z.string().describe("Chat ID"),
    keyword: z.string().describe("Filter keyword to delete"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [deleteFilterTool] Deleting filter", { chatId: context.chatId, keyword: context.keyword });

    try {
      const deleted = await botStorage.deleteFilter(context.chatId, context.keyword.toLowerCase());

      if (!deleted) {
        return {
          success: false,
          message: `Filter "${context.keyword}" not found.`,
        };
      }

      logger?.info("✅ [deleteFilterTool] Filter deleted successfully");
      return {
        success: true,
        message: `Filter "${context.keyword}" deleted successfully!`,
      };
    } catch (error: any) {
      logger?.error("❌ [deleteFilterTool] Failed to delete filter", { error: error.message });
      return {
        success: false,
        message: `Failed to delete filter: ${error.message}`,
      };
    }
  },
});

/**
 * Update Stats Tool
 */
export const updateStatsTool = createTool({
  id: "update-stats",
  description: "Update chat statistics",
  inputSchema: z.object({
    chatId: z.string().describe("Chat ID"),
    incrementMessages: z.boolean().optional().describe("Increment message count"),
    incrementCommands: z.boolean().optional().describe("Increment command count"),
    userCount: z.number().optional().describe("User count"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [updateStatsTool] Updating stats", { chatId: context.chatId });

    try {
      await botStorage.updateStats(context.chatId, {
        chatId: context.chatId,
        messageCount: context.incrementMessages ? 1 : 0,
        commandsExecuted: context.incrementCommands ? 1 : 0,
        userCount: context.userCount || 0,
        lastActivity: new Date(),
      });

      logger?.info("✅ [updateStatsTool] Stats updated");
      return { success: true };
    } catch (error: any) {
      logger?.error("❌ [updateStatsTool] Failed to update stats", { error: error.message });
      return { success: false };
    }
  },
});

/**
 * Get Settings Tool
 */
export const getSettingsTool = createTool({
  id: "get-settings",
  description: "Get chat settings",
  inputSchema: z.object({
    chatId: z.string().describe("Chat ID"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    settings: z.object({
      welcomeMessage: z.string().optional(),
      rules: z.string().optional(),
    }).optional(),
    message: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [getSettingsTool] Getting settings", { chatId: context.chatId });

    try {
      const settings = await botStorage.getSettings(context.chatId);
      
      logger?.info("✅ [getSettingsTool] Settings retrieved");
      return {
        success: true,
        settings: {
          welcomeMessage: settings?.welcomeMessage,
          rules: settings?.rules,
        },
        message: "Settings retrieved successfully",
      };
    } catch (error: any) {
      logger?.error("❌ [getSettingsTool] Failed to get settings", { error: error.message });
      return {
        success: false,
        message: `Failed to get settings: ${error.message}`,
      };
    }
  },
});

/**
 * Save Settings Tool
 */
export const saveSettingsTool = createTool({
  id: "save-settings",
  description: "Save chat settings",
  inputSchema: z.object({
    chatId: z.string().describe("Chat ID"),
    welcomeMessage: z.string().optional().describe("Welcome message"),
    goodbyeMessage: z.string().optional().describe("Goodbye message"),
    rules: z.string().optional().describe("Group rules"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [saveSettingsTool] Saving settings", { chatId: context.chatId });

    try {
      const currentSettings = await botStorage.getSettings(context.chatId);
      
      await botStorage.saveSettings({
        chatId: context.chatId,
        welcomeMessage: context.welcomeMessage || currentSettings?.welcomeMessage,
        goodbyeMessage: context.goodbyeMessage || currentSettings?.goodbyeMessage,
        rules: context.rules || currentSettings?.rules,
        antifloodEnabled: currentSettings?.antifloodEnabled || false,
        antifloodLimit: currentSettings?.antifloodLimit || 5,
      });

      logger?.info("✅ [saveSettingsTool] Settings saved");
      return {
        success: true,
        message: "Settings saved successfully!",
      };
    } catch (error: any) {
      logger?.error("❌ [saveSettingsTool] Failed to save settings", { error: error.message });
      return {
        success: false,
        message: `Failed to save settings: ${error.message}`,
      };
    }
  },
});
