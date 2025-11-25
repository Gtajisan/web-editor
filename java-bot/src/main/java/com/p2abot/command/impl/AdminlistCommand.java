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
public class AdminlistCommand implements Command {
    private final TelegramBotService botService;

    @Override
    public String getCommand() {
        return "/adminlist";
    }

    @Override
    public String getDescription() {
        return "Show list of admins";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("👑 [AdminlistCommand] Getting admin list");
        String adminText = "👑 **Group Admins:**\n\n" +
            "• Admin 1\n" +
            "• Admin 2\n" +
            "• Admin 3\n\n" +
            "P2A-Bot ⚙️ (Manager)";
        botService.sendMessage(chatId, adminText, null);
    }
}
