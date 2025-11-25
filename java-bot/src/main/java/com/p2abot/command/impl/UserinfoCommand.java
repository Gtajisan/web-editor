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
public class UserinfoCommand implements Command {
    private final TelegramBotService botService;

    @Override
    public String getCommand() {
        return "/userinfo";
    }

    @Override
    public String getDescription() {
        return "Show user information";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("👤 [UserinfoCommand] Getting user info");
        Long targetUserId = parseUserId(args);
        if (targetUserId == null) targetUserId = userId;
        
        String infoText = String.format(
            "👤 **User Information**\n\n" +
            "User ID: `%d`\n" +
            "Status: Active\n" +
            "Warnings: 0/3\n" +
            "Actions: None",
            targetUserId
        );
        botService.sendMessage(chatId, infoText, null);
    }

    private Long parseUserId(String arg) {
        try {
            return Long.parseLong(arg.trim());
        } catch (Exception e) {
            return null;
        }
    }
}
