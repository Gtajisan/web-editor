import { createStep, createWorkflow } from "../inngest";
import { z } from "zod";
import { p2aBotAgent } from "../agents/p2aBotAgent";

/**
 * P2A-Bot Workflow
 * Developer: Gtajisan
 * 
 * This workflow processes incoming Telegram messages and executes bot commands
 */

/**
 * Step 1: Process Telegram Message with Bot Agent
 */
const processTelegramMessage = createStep({
  id: "process-telegram-message",
  description: "Process incoming Telegram message using P2A-Bot agent",

  inputSchema: z.object({
    chatId: z.union([z.string(), z.number()]).describe("Chat ID where message was sent"),
    userId: z.number().describe("User ID who sent the message"),
    userName: z.string().describe("Username of the sender"),
    message: z.string().describe("Message text"),
    messageId: z.number().describe("Message ID"),
    threadId: z.string().describe("Thread ID for conversation context"),
  }),

  outputSchema: z.object({
    chatId: z.union([z.string(), z.number()]),
    messageId: z.number(),
    response: z.string(),
    success: z.boolean(),
    actionTaken: z.string().optional(),
  }),

  execute: async ({ inputData, mastra }) => {
    const logger = mastra?.getLogger();
    logger?.info("🚀 [processTelegramMessage] Processing message", {
      chatId: inputData.chatId,
      userId: inputData.userId,
      userName: inputData.userName,
      message: inputData.message,
    });

    try {
      // Construct a prompt for the agent with full context
      const prompt = `
New message in chat ${inputData.chatId} from @${inputData.userName} (ID: ${inputData.userId}):
"${inputData.message}"

Chat ID: ${inputData.chatId}
Message ID: ${inputData.messageId}
User ID: ${inputData.userId}

Please process this message according to your instructions. If it's a command, execute it using the appropriate tools. If it's a regular message, respond helpfully.
`;

      // Call the agent using generateLegacy for SDK v4 compatibility
      const response = await p2aBotAgent.generateLegacy(
        [{ role: "user", content: prompt }],
        {
          resourceId: `chat-${inputData.chatId}`,
          threadId: inputData.threadId,
          maxSteps: 10, // Allow multi-step reasoning for complex commands
        }
      );

      logger?.info("✅ [processTelegramMessage] Agent processing complete", {
        responseLength: response.text.length,
      });

      return {
        chatId: inputData.chatId,
        messageId: inputData.messageId,
        response: response.text,
        success: true,
        actionTaken: "Message processed by P2A-Bot agent",
      };
    } catch (error: any) {
      logger?.error("❌ [processTelegramMessage] Error processing message", {
        error: error.message,
        stack: error.stack,
      });

      return {
        chatId: inputData.chatId,
        messageId: inputData.messageId,
        response: "Sorry, I encountered an error processing your message. Please try again.",
        success: false,
        actionTaken: `Error: ${error.message}`,
      };
    }
  },
});

/**
 * Step 2: Send Response Back to Telegram
 */
const sendResponse = createStep({
  id: "send-response",
  description: "Send bot response back to Telegram chat",

  inputSchema: z.object({
    chatId: z.union([z.string(), z.number()]).describe("Chat ID"),
    messageId: z.number().describe("Message ID to reply to"),
    response: z.string(),
    success: z.boolean(),
    actionTaken: z.string().optional(),
  }),

  outputSchema: z.object({
    summary: z.string(),
    success: z.boolean(),
  }),

  execute: async ({ inputData, mastra }) => {
    const logger = mastra?.getLogger();
    
    logger?.info("📤 [sendResponse] Sending response to Telegram", {
      chatId: inputData.chatId,
      responseLength: inputData.response.length,
    });

    try {
      // Use Telegram HTTP API directly instead of Telegraf
      if (inputData.response && inputData.response.trim().length > 0) {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        
        if (!token) {
          throw new Error("TELEGRAM_BOT_TOKEN is not configured");
        }
        
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: inputData.chatId,
            text: inputData.response,
            reply_parameters: {
              message_id: inputData.messageId,
            },
          }),
        });

        const responseData = await response.json();
        
        // Check both HTTP status and Telegram's ok flag
        if (!response.ok || !responseData.ok) {
          const errorMessage = responseData.description || response.statusText || "Unknown error";
          logger?.error("❌ [sendResponse] Telegram API returned error", { 
            error: errorMessage,
            ok: responseData.ok,
            statusCode: response.status 
          });
          throw new Error(`Telegram API error: ${errorMessage}`);
        }

        logger?.info("✅ [sendResponse] Response sent successfully", {
          messageId: responseData.result?.message_id,
        });
      }

      return {
        summary: `P2A-Bot processed and responded. Action: ${inputData.actionTaken || "Message handled"}`,
        success: inputData.success,
      };
    } catch (error: any) {
      logger?.error("❌ [sendResponse] Failed to send response", { 
        error: error.message,
        chatId: inputData.chatId,
      });
      // Try to send without reply if reply fails
      try {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (token && error.message.includes("reply")) {
          logger?.info("🔄 [sendResponse] Retrying without reply", { chatId: inputData.chatId });
          const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: inputData.chatId,
              text: inputData.response,
            }),
          });
          const data = await response.json();
          if (data.ok) {
            logger?.info("✅ [sendResponse] Fallback message sent");
            return {
              summary: `P2A-Bot responded (fallback). Action: ${inputData.actionTaken || "Message handled"}`,
              success: true,
            };
          }
        }
      } catch (fallbackError: any) {
        logger?.error("❌ [sendResponse] Fallback also failed", { error: fallbackError.message });
      }
      
      return {
        summary: `Failed to send response: ${error.message}`,
        success: false,
      };
    }
  },
});

/**
 * Create the P2A-Bot workflow
 */
export const p2aBotWorkflow = createWorkflow({
  id: "p2a-bot-workflow",

  inputSchema: z.object({
    chatId: z.union([z.string(), z.number()]).describe("Chat ID"),
    userId: z.number().describe("User ID"),
    userName: z.string().describe("Username"),
    message: z.string().describe("Message text"),
    messageId: z.number().describe("Message ID"),
    threadId: z.string().describe("Thread ID for conversation tracking"),
  }) as any,

  outputSchema: z.object({
    summary: z.string(),
    success: z.boolean(),
  }),
})
  .then(processTelegramMessage as any)
  .then(sendResponse as any)
  .commit();
