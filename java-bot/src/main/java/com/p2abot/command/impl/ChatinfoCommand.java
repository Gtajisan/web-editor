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
public class ChatinfoCommand implements Command {
    private final TelegramBotService botService;

    @Override
    public String getCommand() {
        return "/chatinfo";
    }

    @Override
    public String getDescription() {
        return "Show chat information";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("ℹ️ [ChatinfoCommand] Getting chat info");
        String infoText = String.format(
            "ℹ️ **Chat Information**\n\n" +
            "Chat ID: `%d`\n" +
            "Chat Type: Group\n" +
            "Status: Active\n" +
            "P2A-Bot: Protecting this group",
            chatId
        );
        botService.sendMessage(chatId, infoText, null);
    }
}
