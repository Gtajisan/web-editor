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
public class UnbanCommand implements Command {
    private final TelegramBotService botService;

    @Override
    public String getCommand() {
        return "/unban";
    }

    @Override
    public String getDescription() {
        return "Unban user from group";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("✅ [UnbanCommand] Unbanning user");
        Long targetUserId = parseUserId(args);
        if (targetUserId != null) {
            botService.sendMessage(chatId, "✅ User unbanned successfully", null);
        } else {
            botService.sendMessage(chatId, "❓ Usage: /unban <user_id>", null);
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
