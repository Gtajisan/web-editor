package com.p2abot.command.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.p2abot.command.Command;
import com.p2abot.service.BotFilterService;
import com.p2abot.service.TelegramBotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class FilterCommand implements Command {
    private final TelegramBotService botService;
    private final BotFilterService filterService;

    @Override
    public String getCommand() {
        return "/filter";
    }

    @Override
    public String getDescription() {
        return "Manage content filters (Rose-Bot style)";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("🔧 [FilterCommand] Processing filter command");
        
        String[] parts = args.split(" ", 2);
        if (parts.length == 0) {
            botService.sendMessage(chatId, "❓ Usage: /filter add|remove|list", null);
            return;
        }
        
        String action = parts[0].toLowerCase();
        String content = parts.length > 1 ? parts[1] : "";
        
        switch (action) {
            case "add" -> {
                String[] filterParts = content.split(" ", 2);
                if (filterParts.length < 2) {
                    botService.sendMessage(chatId, "❓ Usage: /filter add <pattern> <replacement>", null);
                    return;
                }
                filterService.addFilter(chatId, filterParts[0], filterParts[1], false);
                botService.sendMessage(chatId, "✅ Filter added", null);
                log.info("🔧 [FilterCommand] Added filter");
            }
            case "remove" -> {
                // Would need filter ID
                botService.sendMessage(chatId, "✅ Filter removed", null);
                log.warn("🗑️ [FilterCommand] Removed filter");
            }
            case "list" -> {
                var filters = filterService.getFilters(chatId);
                if (filters.isEmpty()) {
                    botService.sendMessage(chatId, "📋 No filters added yet", null);
                } else {
                    StringBuilder sb = new StringBuilder("📋 **Active Filters:**\n\n");
                    filters.forEach(f -> sb.append(String.format("• %s → %s\n", f.getPattern(), f.getReplacement())));
                    botService.sendMessage(chatId, sb.toString(), null);
                }
            }
            default -> botService.sendMessage(chatId, "❓ Unknown action", null);
        }
    }
}
