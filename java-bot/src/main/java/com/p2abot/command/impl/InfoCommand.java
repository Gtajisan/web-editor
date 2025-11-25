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
public class InfoCommand implements Command {
    private final TelegramBotService botService;

    @Override
    public String getCommand() {
        return "/info";
    }

    @Override
    public String getDescription() {
        return "Show bot information";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("ℹ️ [InfoCommand] Displaying bot info");
        
        String infoText = """
            ℹ️ **P2A-Bot v2 Information**
            
            🐐 **Edition:** Java GOAT
            📦 **Version:** 2.0.0
            
            🏗️ **Framework:** Spring Boot 3.2
            💾 **Database:** SQLite
            ⚡ **Performance:** Ultra-fast
            
            **Based on:** Rose-Bot features
            **Features:**
            • User moderation (ban, kick, warn, mute)
            • Content filtering
            • Note management
            • Statistics tracking
            • Welcome messages
            • Anti-spam protection
            
            **Developers:** Gtajisan
            **License:** MIT
            """;
        
        botService.sendMessage(chatId, infoText, null);
    }
}
