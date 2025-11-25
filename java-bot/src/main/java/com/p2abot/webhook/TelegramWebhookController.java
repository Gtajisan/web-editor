package com.p2abot.webhook;

import com.fasterxml.jackson.databind.JsonNode;
import com.p2abot.command.CommandHandler;
import com.p2abot.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/webhook")
@RequiredArgsConstructor
public class TelegramWebhookController {
    private final TelegramBotService botService;
    private final BotNoteService noteService;
    private final BotFilterService filterService;
    private final UserWarningService warningService;
    private final BotStatsService statsService;
    private final CommandHandler commandHandler;

    @PostMapping("/telegram")
    public ResponseEntity<String> handleTelegramWebhook(@RequestBody JsonNode update) {
        log.info("📨 [P2A-Bot] Received Telegram webhook");

        try {
            if (!update.has("message")) {
                log.debug("⏭️ [P2A-Bot] Skipping non-message update");
                return ResponseEntity.ok("OK");
            }

            JsonNode message = update.get("message");
            Long chatId = message.get("chat").get("id").asLong();
            Long userId = message.get("from").get("id").asLong();
            String text = message.has("text") ? message.get("text").asText() : "";
            Integer messageId = message.get("message_id").asInt();

            log.info("💬 [P2A-Bot] Message from user {} in chat {}: {}", userId, chatId, text);

            // Update stats
            statsService.incrementMessages(chatId);

            // Handle commands
            if (text.startsWith("/")) {
                log.info("⚡ [P2A-Bot] Executing command");
                commandHandler.handleCommand(chatId, userId, text, message);
            } else {
                // Apply filters to regular messages
                String filteredText = filterService.applyFilters(chatId, text);
                
                if (!filteredText.equals(text)) {
                    log.info("🔧 [P2A-Bot] Message modified by filters");
                    botService.deleteMessage(chatId, messageId);
                    botService.sendMessage(chatId, "⚠️ Message violates chat rules", messageId);
                }
            }

            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            log.error("❌ [P2A-Bot] Error processing webhook: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error");
        }
    }
}
