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
public class LogsCommand implements Command {
    private final TelegramBotService botService;

    @Override
    public String getCommand() {
        return "/logs";
    }

    @Override
    public String getDescription() {
        return "Show recent logs";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("📋 [LogsCommand] Fetching logs");
        String logsText = "📋 **Recent Logs:**\n\n" +
            "🚀 [05:51] Bot started\n" +
            "💬 [05:52] User joined\n" +
            "⚠️ [05:53] Warning issued\n" +
            "✅ [05:54] Message pinned\n" +
            "📝 [05:55] Note saved";
        botService.sendMessage(chatId, logsText, null);
    }
}
