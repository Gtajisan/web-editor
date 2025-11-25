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
public class UnmuteCommand implements Command {
    private final TelegramBotService botService;

    @Override
    public String getCommand() {
        return "/unmute";
    }

    @Override
    public String getDescription() {
        return "Unmute user";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("🔊 [UnmuteCommand] Unmuting user");
        Long targetUserId = parseUserId(args);
        if (targetUserId != null) {
            botService.sendMessage(chatId, "🔊 User unmuted", null);
        } else {
            botService.sendMessage(chatId, "❓ Usage: /unmute <user_id>", null);
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
