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
public class AntifloodCommand implements Command {
    private final TelegramBotService botService;

    @Override
    public String getCommand() {
        return "/antiflood";
    }

    @Override
    public String getDescription() {
        return "Enable/disable antiflood protection";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("🚫 [AntifloodCommand] Antiflood setting");
        String action = args.toLowerCase().trim();
        
        if (action.equals("on") || action.equals("enable")) {
            botService.sendMessage(chatId, "🚫 Antiflood: **ENABLED**", null);
            log.info("🚫 Antiflood enabled for chat: {}", chatId);
        } else if (action.equals("off") || action.equals("disable")) {
            botService.sendMessage(chatId, "✅ Antiflood: **DISABLED**", null);
        } else {
            botService.sendMessage(chatId, "❓ Usage: /antiflood on/off", null);
        }
    }
}
