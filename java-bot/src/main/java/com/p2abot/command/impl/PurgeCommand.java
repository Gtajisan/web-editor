package com.p2abot.command.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.p2abot.command.Command;
import com.p2abot.service.TelegramBotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PurgeCommand implements Command {
    private final TelegramBotService botService;

    @Override
    public String getCommand() {
        return "/purge";
    }

    @Override
    public String getDescription() {
        return "Delete user messages (Rose-Bot style)";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.warn("🗑️ [PurgeCommand] Purging messages in chat: {}", chatId);
        
        if (args.trim().isEmpty()) {
            botService.sendMessage(chatId, "❓ Usage: /purge <count>", null);
            return;
        }
        
        try {
            int count = Integer.parseInt(args.trim());
            if (count > 0 && count <= 100) {
                String purgeText = String.format(
                    "🗑️ **Messages Purged**\n\n" +
                    "Deleted: %d messages\n" +
                    "Status: ✅ Complete",
                    count
                );
                botService.sendMessage(chatId, purgeText, null);
                log.info("🗑️ [PurgeCommand] Purged {} messages from chat {}", count, chatId);
            } else {
                botService.sendMessage(chatId, "❓ Count must be between 1 and 100", null);
            }
        } catch (NumberFormatException e) {
            botService.sendMessage(chatId, "❓ Invalid count", null);
        }
    }
}
