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
public class PinCommand implements Command {
    private final TelegramBotService botService;

    @Override
    public String getCommand() {
        return "/pin";
    }

    @Override
    public String getDescription() {
        return "Pin a message";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("📌 [PinCommand] Pinning message");
        botService.sendMessage(chatId, "📌 Message pinned", null);
    }
}
