package com.p2abot.command.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.p2abot.command.Command;
import com.p2abot.service.BotStatsService;
import com.p2abot.service.TelegramBotService;
import com.p2abot.service.UserWarningService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class WarnCommand implements Command {
    private final TelegramBotService botService;
    private final UserWarningService warningService;
    private final BotStatsService statsService;

    @Override
    public String getCommand() {
        return "/warn";
    }

    @Override
    public String getDescription() {
        return "Warn user (Rose-Bot style)";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.warn("⚠️ [WarnCommand] Warning user in chat: {}", chatId);
        
        String[] parts = args.split(" ", 2);
        Long targetUserId = parseUserId(parts.length > 0 ? parts[0] : "");
        String reason = parts.length > 1 ? parts[1] : "No reason provided";
        
        if (targetUserId != null) {
            var warning = warningService.addWarning(chatId, targetUserId, reason);
            statsService.incrementWarnings(chatId);
            
            String warnText = String.format(
                "⚠️ **User Warned**\n\n" +
                "User ID: `%d`\n" +
                "Reason: %s\n" +
                "Warning Count: %d/3",
                targetUserId, reason, warning.getWarningCount()
            );
            
            if (warning.getWarningCount() >= 3) {
                botService.sendMessage(chatId, "🚫 User auto-banned (3 warnings)", null);
                botService.banUser(chatId, targetUserId);
                statsService.incrementBans(chatId);
            } else {
                botService.sendMessage(chatId, warnText, null);
            }
        } else {
            botService.sendMessage(chatId, "❓ Usage: /warn <user_id> [reason]", null);
        }
    }

    private Long parseUserId(String arg) {
        try {
            if (arg.startsWith("@")) return null;
            return Long.parseLong(arg.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
