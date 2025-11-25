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
public class SettingsCommand implements Command {
    private final TelegramBotService botService;

    @Override
    public String getCommand() {
        return "/settings";
    }

    @Override
    public String getDescription() {
        return "View/modify bot settings";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("⚙️ [SettingsCommand] Showing settings");
        String settingsText = "⚙️ **Bot Settings:**\n\n" +
            "🚫 Antiflood: ON\n" +
            "👋 Welcome: ON\n" +
            "📝 Filters: 5 active\n" +
            "⚠️ Auto-ban at: 3 warnings\n" +
            "🔐 Admin only: OFF";
        botService.sendMessage(chatId, settingsText, null);
    }
}
