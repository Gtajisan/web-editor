import type { ContentfulStatusCode } from "hono/utils/http-status";

import { registerApiRoute } from "../mastra/inngest";
import { Mastra } from "@mastra/core";

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.warn(
    "Trying to initialize Telegram triggers without TELEGRAM_BOT_TOKEN. Can you confirm that the Telegram integration is configured correctly?",
  );
}

export type TriggerInfoTelegramOnNewMessage = {
  type: "telegram/message";
  params: {
    chatId: number | string;
    userId: number;
    userName: string;
    message: string;
    messageId: number;
    replyToMessageId?: number;
    replyToUserId?: number;
    chatType: string;
  };
  payload: any;
};

export function registerTelegramTrigger({
  triggerType,
  handler,
}: {
  triggerType: string;
  handler: (
    mastra: Mastra,
    triggerInfo: TriggerInfoTelegramOnNewMessage,
  ) => Promise<void>;
}) {
  return [
    registerApiRoute("/webhooks/telegram/action", {
      method: "POST",
      handler: async (c) => {
        const mastra = c.get("mastra");
        const logger = mastra.getLogger();
        try {
          const payload = await c.req.json();

          logger?.info("📝 [Telegram] Received webhook", { 
            updateId: payload.update_id,
            hasMessage: !!payload.message,
          });

          // Handle different update types
          if (!payload.message) {
            logger?.info("⏭️ [Telegram] Skipping non-message update");
            return c.text("OK", 200);
          }

          const message = payload.message;
          const chat = message.chat;
          const from = message.from;

          // Skip messages without text for now (photos, stickers, etc.)
          // But log them for visibility
          if (!message.text) {
            logger?.info("⏭️ [Telegram] Skipping non-text message", {
              messageType: message.photo ? 'photo' : message.sticker ? 'sticker' : 'other',
              chatId: chat.id,
            });
            return c.text("OK", 200);
          }

          // Extract reply information if present
          const replyToMessageId = message.reply_to_message?.message_id;
          const replyToUserId = message.reply_to_message?.from?.id;

          logger?.info("📨 [Telegram] Processing text message", {
            chatId: chat.id,
            userId: from.id,
            hasReply: !!replyToMessageId,
            chatType: chat.type,
          });

          await handler(mastra, {
            type: triggerType,
            params: {
              chatId: chat.id,
              userId: from.id,
              userName: from.username || from.first_name || "Unknown",
              message: message.text,
              messageId: message.message_id,
              replyToMessageId,
              replyToUserId,
              chatType: chat.type,
            },
            payload,
          } as TriggerInfoTelegramOnNewMessage);

          return c.text("OK", 200);
        } catch (error: any) {
          logger?.error("❌ [Telegram] Error handling webhook", { 
            error: error.message,
            stack: error.stack,
          });
          return c.text("Internal Server Error", 500);
        }
      },
    }),
  ];
}
