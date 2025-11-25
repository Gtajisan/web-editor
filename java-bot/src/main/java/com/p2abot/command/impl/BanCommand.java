package com.p2abot.command.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.p2abot.command.Command;
import com.p2abot.service.BotStatsService;
import com.p2abot.service.TelegramBotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class BanCommand implements Command {
    private final TelegramBotService botService;
    private final BotStatsService statsService;

    @Override
    public String getCommand() {
        return "/ban";
    }

    @Override
    public String getDescription() {
        return "Ban user from the group";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.warn("🚫 [BanCommand] Ban request in chat: {}", chatId);
        
        // Parse user ID from args or reply
        Long targetUserId = parseUserId(args);
        
        if (targetUserId != null) {
            boolean success = botService.banUser(chatId, targetUserId);
            if (success) {
                statsService.incrementBans(chatId);
                botService.sendMessage(chatId, "🚫 User banned from group", null);
                log.info("✅ [BanCommand] User {} banned successfully", targetUserId);
            } else {
                botService.sendMessage(chatId, "❌ Failed to ban user (check permissions)", null);
            }
        } else {
            botService.sendMessage(chatId, "❓ Please specify user to ban: /ban @username or /ban <user_id>", null);
        }
    }

    private Long parseUserId(String args) {
        try {
            if (args.startsWith("@")) {
                // Parse @username - would need additional API call
                return null;
            }
            return Long.parseLong(args.trim());
        } catch (NumberFormatException e) {
            log.debug("Could not parse user ID: {}", args);
            return null;
        }
    }
}
