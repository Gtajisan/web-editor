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
public class UnpinCommand implements Command {
    private final TelegramBotService botService;

    @Override
    public String getCommand() {
        return "/unpin";
    }

    @Override
    public String getDescription() {
        return "Unpin a message";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("📌 [UnpinCommand] Unpinning message");
        botService.sendMessage(chatId, "✅ Message unpinned", null);
    }
}
