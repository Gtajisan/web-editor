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
public class StartCommand implements Command {
    private final TelegramBotService botService;

    @Override
    public String getCommand() {
        return "/start";
    }

    @Override
    public String getDescription() {
        return "Start the bot and show welcome message";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("🚀 [StartCommand] Executing start command");
        
        String welcomeText = """
            🐐 **Welcome to GOAT Bot v2** - Java Edition!
            
            I'm a powerful Telegram group management bot built for efficiency.
            
            **Quick Start:**
            /help - Show all commands
            /stats - View group statistics
            /notes - Manage notes
            
            **Features:**
            • User moderation (ban, kick, warn)
            • Message filtering
            • Note management
            • Statistics tracking
            
            Need help? /help
            """;
        
        botService.sendMessage(chatId, welcomeText, null);
    }
}
