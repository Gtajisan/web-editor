package com.p2abot.command.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.p2abot.command.Command;
import com.p2abot.service.TelegramBotService;
import com.p2abot.service.UserWarningService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class ClearwarnsCommand implements Command {
    private final TelegramBotService botService;
    private final UserWarningService warningService;

    @Override
    public String getCommand() {
        return "/clearwarns";
    }

    @Override
    public String getDescription() {
        return "Clear all warnings for user";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("✅ [ClearwarnsCommand] Clearing warnings");
        Long targetUserId = parseUserId(args);
        if (targetUserId != null) {
            warningService.clearWarnings(chatId, targetUserId);
            botService.sendMessage(chatId, "✅ Warnings cleared", null);
        } else {
            botService.sendMessage(chatId, "❓ Usage: /clearwarns <user_id>", null);
        }
    }

    private Long parseUserId(String arg) {
        try {
            return Long.parseLong(arg.trim());
        } catch (Exception e) {
            return null;
        }
    }
}
