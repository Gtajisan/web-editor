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
public class KickCommand implements Command {
    private final TelegramBotService botService;
    private final BotStatsService statsService;

    @Override
    public String getCommand() {
        return "/kick";
    }

    @Override
    public String getDescription() {
        return "Kick user from the group";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.warn("👢 [KickCommand] Kick request in chat: {}", chatId);
        
        Long targetUserId = parseUserId(args);
        
        if (targetUserId != null) {
            boolean success = botService.kickUser(chatId, targetUserId);
            if (success) {
                statsService.incrementKicks(chatId);
                botService.sendMessage(chatId, "👢 User kicked from group", null);
                log.info("✅ [KickCommand] User {} kicked successfully", targetUserId);
            } else {
                botService.sendMessage(chatId, "❌ Failed to kick user (check permissions)", null);
            }
        } else {
            botService.sendMessage(chatId, "❓ Please specify user to kick: /kick @username or /kick <user_id>", null);
        }
    }

    private Long parseUserId(String args) {
        try {
            if (args.startsWith("@")) {
                return null;
            }
            return Long.parseLong(args.trim());
        } catch (NumberFormatException e) {
            log.debug("Could not parse user ID: {}", args);
            return null;
        }
    }
}
