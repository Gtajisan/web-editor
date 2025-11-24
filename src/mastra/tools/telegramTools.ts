import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { Telegraf } from "telegraf";

/**
 * P2A-Bot Telegram Tools
 * 
 * These tools provide Rose-Bot inspired functionality for group management
 * Developer: Gtajisan
 */

// Initialize Telegraf bot instance
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");

/**
 * Send Message Tool
 * Sends a message to a Telegram chat
 */
export const sendMessageTool = createTool({
  id: "send-telegram-message",
  description: "Send a message to a Telegram chat",
  inputSchema: z.object({
    chatId: z.union([z.string(), z.number()]).describe("Chat ID to send message to"),
    message: z.string().describe("Message text to send"),
    replyToMessageId: z.number().optional().describe("Message ID to reply to"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    messageId: z.number().optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [sendMessageTool] Sending message", { chatId: context.chatId });

    try {
      const result = await bot.telegram.sendMessage(
        context.chatId,
        context.message,
        context.replyToMessageId ? { reply_parameters: { message_id: context.replyToMessageId } } : {}
      );
      
      logger?.info("✅ [sendMessageTool] Message sent successfully", { messageId: result.message_id });
      return {
        success: true,
        messageId: result.message_id,
      };
    } catch (error: any) {
      logger?.error("❌ [sendMessageTool] Failed to send message", { error: error.message });
      return {
        success: false,
        error: error.message,
      };
    }
  },
});

/**
 * Ban User Tool
 * Bans a user from a chat
 */
export const banUserTool = createTool({
  id: "ban-user",
  description: "Ban a user from a Telegram group chat",
  inputSchema: z.object({
    chatId: z.union([z.string(), z.number()]).describe("Chat ID"),
    userId: z.number().describe("User ID to ban"),
    reason: z.string().optional().describe("Reason for ban"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [banUserTool] Banning user", { chatId: context.chatId, userId: context.userId });

    try {
      await bot.telegram.banChatMember(context.chatId, context.userId);
      const msg = context.reason 
        ? `User banned successfully. Reason: ${context.reason}`
        : "User banned successfully";
      
      logger?.info("✅ [banUserTool] User banned", { userId: context.userId });
      return {
        success: true,
        message: msg,
      };
    } catch (error: any) {
      logger?.error("❌ [banUserTool] Failed to ban user", { error: error.message });
      return {
        success: false,
        message: `Failed to ban user: ${error.message}`,
      };
    }
  },
});

/**
 * Kick User Tool
 * Kicks a user from a chat (can rejoin via invite link)
 */
export const kickUserTool = createTool({
  id: "kick-user",
  description: "Kick a user from a Telegram group chat (they can rejoin)",
  inputSchema: z.object({
    chatId: z.union([z.string(), z.number()]).describe("Chat ID"),
    userId: z.number().describe("User ID to kick"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [kickUserTool] Kicking user", { chatId: context.chatId, userId: context.userId });

    try {
      await bot.telegram.banChatMember(context.chatId, context.userId);
      await bot.telegram.unbanChatMember(context.chatId, context.userId);
      
      logger?.info("✅ [kickUserTool] User kicked", { userId: context.userId });
      return {
        success: true,
        message: "User kicked successfully",
      };
    } catch (error: any) {
      logger?.error("❌ [kickUserTool] Failed to kick user", { error: error.message });
      return {
        success: false,
        message: `Failed to kick user: ${error.message}`,
      };
    }
  },
});

/**
 * Mute User Tool
 * Restricts a user from sending messages
 */
export const muteUserTool = createTool({
  id: "mute-user",
  description: "Mute a user in a Telegram group chat",
  inputSchema: z.object({
    chatId: z.union([z.string(), z.number()]).describe("Chat ID"),
    userId: z.number().describe("User ID to mute"),
    duration: z.number().optional().describe("Mute duration in seconds (0 for permanent)"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [muteUserTool] Muting user", { chatId: context.chatId, userId: context.userId });

    try {
      const untilDate = context.duration ? Math.floor(Date.now() / 1000) + context.duration : 0;
      
      await bot.telegram.restrictChatMember(context.chatId, context.userId, {
        permissions: {
          can_send_messages: false,
          can_send_polls: false,
          can_send_other_messages: false,
        },
        until_date: untilDate,
      });
      
      logger?.info("✅ [muteUserTool] User muted", { userId: context.userId, duration: context.duration });
      return {
        success: true,
        message: context.duration 
          ? `User muted for ${context.duration} seconds`
          : "User muted permanently",
      };
    } catch (error: any) {
      logger?.error("❌ [muteUserTool] Failed to mute user", { error: error.message });
      return {
        success: false,
        message: `Failed to mute user: ${error.message}`,
      };
    }
  },
});

/**
 * Unmute User Tool
 * Removes restrictions from a user
 */
export const unmuteUserTool = createTool({
  id: "unmute-user",
  description: "Unmute a user in a Telegram group chat",
  inputSchema: z.object({
    chatId: z.union([z.string(), z.number()]).describe("Chat ID"),
    userId: z.number().describe("User ID to unmute"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [unmuteUserTool] Unmuting user", { chatId: context.chatId, userId: context.userId });

    try {
      await bot.telegram.restrictChatMember(context.chatId, context.userId, {
        permissions: {
          can_send_messages: true,
          can_send_polls: true,
          can_send_other_messages: true,
        },
      });
      
      logger?.info("✅ [unmuteUserTool] User unmuted", { userId: context.userId });
      return {
        success: true,
        message: "User unmuted successfully",
      };
    } catch (error: any) {
      logger?.error("❌ [unmuteUserTool] Failed to unmute user", { error: error.message });
      return {
        success: false,
        message: `Failed to unmute user: ${error.message}`,
      };
    }
  },
});

/**
 * Get User Info Tool
 * Retrieves information about a user
 */
export const getUserInfoTool = createTool({
  id: "get-user-info",
  description: "Get information about a Telegram user",
  inputSchema: z.object({
    userId: z.number().describe("User ID to get info for"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    userInfo: z.object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string().optional(),
      username: z.string().optional(),
      isBot: z.boolean(),
    }).optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [getUserInfoTool] Getting user info", { userId: context.userId });

    try {
      const chat = await bot.telegram.getChat(context.userId);
      
      logger?.info("✅ [getUserInfoTool] User info retrieved", { userId: context.userId });
      return {
        success: true,
        userInfo: {
          id: chat.id,
          firstName: (chat as any).first_name || "Unknown",
          lastName: (chat as any).last_name,
          username: (chat as any).username,
          isBot: false,
        },
      };
    } catch (error: any) {
      logger?.error("❌ [getUserInfoTool] Failed to get user info", { error: error.message });
      return {
        success: false,
        error: error.message,
      };
    }
  },
});

/**
 * Delete Message Tool
 * Deletes a message from a chat
 */
export const deleteMessageTool = createTool({
  id: "delete-message",
  description: "Delete a message from a Telegram chat",
  inputSchema: z.object({
    chatId: z.union([z.string(), z.number()]).describe("Chat ID"),
    messageId: z.number().describe("Message ID to delete"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [deleteMessageTool] Deleting message", { chatId: context.chatId, messageId: context.messageId });

    try {
      await bot.telegram.deleteMessage(context.chatId, context.messageId);
      
      logger?.info("✅ [deleteMessageTool] Message deleted", { messageId: context.messageId });
      return {
        success: true,
        message: "Message deleted successfully",
      };
    } catch (error: any) {
      logger?.error("❌ [deleteMessageTool] Failed to delete message", { error: error.message });
      return {
        success: false,
        message: `Failed to delete message: ${error.message}`,
      };
    }
  },
});

/**
 * Pin Message Tool
 * Pins a message in a chat
 */
export const pinMessageTool = createTool({
  id: "pin-message",
  description: "Pin a message in a Telegram chat",
  inputSchema: z.object({
    chatId: z.union([z.string(), z.number()]).describe("Chat ID"),
    messageId: z.number().describe("Message ID to pin"),
    disableNotification: z.boolean().optional().describe("Pin silently without notification"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [pinMessageTool] Pinning message", { chatId: context.chatId, messageId: context.messageId });

    try {
      await bot.telegram.pinChatMessage(
        context.chatId,
        context.messageId,
        { disable_notification: context.disableNotification }
      );
      
      logger?.info("✅ [pinMessageTool] Message pinned", { messageId: context.messageId });
      return {
        success: true,
        message: "Message pinned successfully",
      };
    } catch (error: any) {
      logger?.error("❌ [pinMessageTool] Failed to pin message", { error: error.message });
      return {
        success: false,
        message: `Failed to pin message: ${error.message}`,
      };
    }
  },
});

/**
 * Get Chat Info Tool
 * Retrieves information about a chat
 */
export const getChatInfoTool = createTool({
  id: "get-chat-info",
  description: "Get information about a Telegram chat",
  inputSchema: z.object({
    chatId: z.union([z.string(), z.number()]).describe("Chat ID"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    chatInfo: z.object({
      id: z.number(),
      type: z.string(),
      title: z.string().optional(),
      username: z.string().optional(),
      memberCount: z.number().optional(),
    }).optional(),
    error: z.string().optional(),
  }),
  execute: async ({ context, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🔧 [getChatInfoTool] Getting chat info", { chatId: context.chatId });

    try {
      const chat = await bot.telegram.getChat(context.chatId);
      let memberCount;
      
      try {
        memberCount = await bot.telegram.getChatMembersCount(context.chatId);
      } catch {
        memberCount = undefined;
      }
      
      logger?.info("✅ [getChatInfoTool] Chat info retrieved", { chatId: context.chatId });
      return {
        success: true,
        chatInfo: {
          id: chat.id,
          type: chat.type,
          title: (chat as any).title,
          username: (chat as any).username,
          memberCount,
        },
      };
    } catch (error: any) {
      logger?.error("❌ [getChatInfoTool] Failed to get chat info", { error: error.message });
      return {
        success: false,
        error: error.message,
      };
    }
  },
});
