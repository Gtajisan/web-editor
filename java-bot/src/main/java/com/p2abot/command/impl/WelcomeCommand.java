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
public class WelcomeCommand implements Command {
    private final TelegramBotService botService;

    @Override
    public String getCommand() {
        return "/welcome";
    }

    @Override
    public String getDescription() {
        return "Set welcome message (Rose-Bot style)";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("👋 [WelcomeCommand] Setting welcome message for chat: {}", chatId);
        
        if (args.trim().isEmpty()) {
            botService.sendMessage(chatId, "❓ Usage: /welcome <message>", null);
            return;
        }
        
        String welcomeMsg = String.format(
            "👋 **Welcome Message Set**\n\n" +
            "Message: %s\n\n" +
            "New members will be greeted with this message!",
            args
        );
        
        botService.sendMessage(chatId, welcomeMsg, null);
        log.info("✅ [WelcomeCommand] Welcome message updated");
    }
}
