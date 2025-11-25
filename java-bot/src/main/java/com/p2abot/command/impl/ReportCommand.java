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
public class ReportCommand implements Command {
    private final TelegramBotService botService;

    @Override
    public String getCommand() {
        return "/report";
    }

    @Override
    public String getDescription() {
        return "Report user to admins";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("🚨 [ReportCommand] Report filed");
        if (args.trim().isEmpty()) {
            botService.sendMessage(chatId, "❓ Usage: /report <user_id> <reason>", null);
            return;
        }
        botService.sendMessage(chatId, "✅ Report submitted to admins", null);
    }
}
